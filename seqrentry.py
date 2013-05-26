#!/usr/bin/env python

import argparse
import base64
import json
import os;
import sys
import syslog

from twisted.internet import reactor
from twisted.internet.error import BindError
from twisted.python.randbytes import secureRandom
from twisted.web import server, static, resource
from xml.etree import ElementTree

PROXY_LIFETIME = 10 * 60
PROXY_WAITTIME = 30

EXTENSIONS = { 'application/json': '.json',
               'application/xml':  '.xml',
               'text/javascript':  '.js' }

proxies = {}

class ProxyBase(resource.Resource):
    def __init__(self, ct):
        self._contentType = ct

        if ct not in EXTENSIONS:
            raise ValueError(str.format('Content-Type {0} is not supported', ct))

    @staticmethod
    def _sendRawResponse(request, status, ct, type, params):
        request.setResponseCode(status if ct != 'text/javascript' else 200)
        request.setHeader('Content-Type', ct)
        request.setHeader('Cache-Control', 'private, max-age=0')

        if ct == 'application/json':
            body = json.dumps([type, params])
        elif ct == 'application/xml':
            body = ElementTree.TreeBuilder()
            body.start(type, params)
            body.end(type)
            body = ElementTree.tostring(body.close())
        elif ct == 'text/javascript':
            body = str.format('SeQRentry.{0}({1}, {2});', type, status, json.dumps(params));

        request.write(body)
        request.finish()

    def _sendResponse(self, request, status, type, params):
        ProxyBase._sendRawResponse(request, status, self._contentType, type, dict({
            'ident': request.args.get('ident', [''])[0] },
            **params))

    def _sendProxyResponse(self, token, status, type, params):
        proxy = proxies[token]

        ProxyBase._sendRawResponse(proxy['request'], status, proxy['ct'], type, dict({
            'ident': proxy['ident'] },
            **params))
        proxy['ct']      = None
        proxy['ident']   = None
        proxy['request'] = None


class CreateProxy(ProxyBase):
    def __init__(self, mode):
        ProxyBase.__init__(self, mode)

    def render_GET(self, request):
        token = self._makeProxy()

        proxy_url = ''.join(['https' if request.isSecure() else 'http',
                             '://', request.requestHeaders.getRawHeaders('host')[0], '/proxy'])

        self._sendResponse(request, 201, 'proxyCreated', {
            'token': token,
            'proxy': args.proxy_url or proxy_url })

        return server.NOT_DONE_YET

    def render_POST(self, request):
        return self.render_GET(request)

    def _makeProxy(self):
        while True:
            token = base64.b64encode(secureRandom(9, False), '-_')

            if token not in proxies:
                proxies[token] = { 'ct': None, 'ident': None, 'request': None, 'creds': None }
                syslog.syslog(syslog.LOG_INFO, "Created proxy " + token)
                break

        reactor.callLater(PROXY_LIFETIME, self._deleteProxy, token)
        return token

    def _deleteProxy(self, token):
        if token in proxies:
            proxy = proxies[token]

            if proxy['request']:
                self._sendProxyResponse(token, 410, 'proxyDeleted', {})

            del proxies[token]
            syslog.syslog(syslog.LOG_INFO, "Removed proxy " + token)

class Proxy(ProxyBase):
    def __init__(self, mode):
        ProxyBase.__init__(self, mode)

    def render_POST(self, request):
        token = request.args.get('token', [''])[0]
        creds = { 'username':     request.args.get('username',    [''])[0],
                  'password':     request.args.get('password',    [''])[0],
                  'new-password': request.args.get('new-password', [''])[0]}

        if token in proxies:
            proxy = proxies[token]
            online = proxy['request']

            if proxy['request']:
                self._sendProxyResponse(token, 200, 'proxyResponse', creds);
            else:
                proxy['creds'] = creds;

            self._sendResponse(request, 200 if online else 202, 'proxyNotified', {})
        else:
            self._sendResponse(request, 402, 'proxyNotFound', {})

        return server.NOT_DONE_YET

    def render_GET(self, request):
        token = request.args.get('token', [''])[0]

        if token in proxies:
            proxy = proxies[token]

            if proxy['request']:
                self._sendResponse(request, 409, 'proxyInUse', {})
            else:
                proxy['ct']      = self._contentType
                proxy['ident']   = request.args.get('ident', [''])[0]
                proxy['request'] = request

                if proxy['creds']:
                    self._sendProxyResponse(token, 200, 'proxyResponse', proxy['creds']);
                    proxy['creds'] = None
                else:
                    reactor.callLater(PROXY_WAITTIME, self._timeoutProxy, token)
        else:
            self._sendResponse(request, 402, 'proxyNotFound', {})

        return server.NOT_DONE_YET

    def _timeoutProxy(self, token):
        if token in proxies:
            proxy = proxies[token]

            if proxy['request']:
                self._sendProxyResponse(token, 408, 'proxyTimeout', {})

if __name__ == '__main__':
    syslog.openlog(logoption=syslog.LOG_PID|syslog.LOG_PERROR, facility=syslog.LOG_DAEMON)

    parser = argparse.ArgumentParser(description='Start the SeQRentry proxy.', add_help = False)
    parser.add_argument('-?', '-h', '--help', help='Display this message and exit', action='store_true', dest='help')
    parser.add_argument('-p', '--proxy-url', metavar = 'URL', help='Override proxy URL returned to clients', dest='proxy_url')
    parser.add_argument('-r', '--root', metavar = 'directory', help='Also serve static files from this directory', dest='root')
    parser.add_argument('-H, --http', default = '*:8080', metavar = '[host:]port',
                        help = 'Listen for HTTP requests on this interface address and port (default: port 8080 on all interfaces)',
                        dest='http')
    args = parser.parse_args()

    if args.help:
        parser.print_help()
        sys.exit(0)

    http = args.http.split(':', 1)

    if len(http) == 1:
        http.insert(0, '');

    if http[0] == '*':
        http[0] = ''

    try:
        path = os.path.abspath(args.root) + '/' if args.root else None;

        if path:
            root = static.File(path)
            root.contentTypes.update({ '.svg': 'image/svg+xml' })
        else:
            root = resource.Resource()

        root.putChild('create-proxy.js', CreateProxy('text/javascript'))
        root.putChild('create-proxy.json', CreateProxy('application/json'))
        root.putChild('create-proxy.xml', CreateProxy('application/xml'))

        root.putChild('proxy.js', Proxy('text/javascript'))
        root.putChild('proxy.json', Proxy('application/json'))
        root.putChild('proxy.xml', Proxy('application/xml'))

        site = server.Site(root)
        reactor.listenTCP(int(http[1]), site, 50, http[0])

        syslog.syslog(syslog.LOG_NOTICE, 'Listening for HTTP requests on {0}.'.format(':'.join(http)))

        if path:
            syslog.syslog(syslog.LOG_NOTICE, 'Also serving static content from {0}.'.format(path))

        print 'Press Control-C to exit.'

        reactor.run()
        print
    except BindError as ex:
        syslog.syslog(syslog.LOG_ERR, str(ex))

    syslog.syslog(syslog.LOG_NOTICE, 'Shut down.')
    syslog.closelog()
