window['SeQRentry'] = {};

// Initialize everything when document is loaded

window.addEventListener('load', function load(ev){
    window.removeEventListener('load', load, false);
    SeQRentry['install']();
}, false);

/** @const */ var SCRIPT_ID     = 'seqrentry-script';
/** @const */ var BANNER_ID     = 'seqrentry-banner';
/** @const */ var QRCODE_ID     = 'seqrentry-qrcode';

/** @const */ var BANNER_HEIGHT = 440 + 6;

/** @const */ var TYPE_ATTR     = 'data-seqrentry-type';     // Element type: form|username|password|register|change|login
/** @const */ var REALM_ATTR    = 'data-seqrentry-realm';    // Authenticaiton realm
/** @const */ var USERNAME_ATTR = 'data-seqrentry-username'; // Override el.value
/** @const */ var ONSET_ATTR    = 'data-seqrentry-func';     // function(type, value) callback

/** @const */ var BUTTON_CLASS  = 'seqrentry-button';
/** @const */ var BUTTON_IMAGE  = '../SeQRentry-logo-v2-64.png';

/** @const */ var SEQRENTRY_URL = 'http://seqrentry.net/';
/** @const */ var PROXY_URL     = 'http://seqrentry.net/';

var channels   = /** @dict */ {}
var channel_id = 0;

function install_button(elem) {
    elem.className += ' ' + BUTTON_CLASS;
    elem.innerHTML = '<img src="' + BUTTON_IMAGE + '" style="width: 100%;" />';
    elem.addEventListener('click', function(ev) { ev.stopPropagation(); create_channel(elem); }, false);

    if (elem.localName == 'button' && !elem.hasAttribute('onclick')) {
	elem.setAttribute('onclick', 'return false;');
    }
}

function decode_password(key, password) {
    var result = [];

    key      = Base64.decode(key, Base64.urlCS);
    password = Base64.decode(password, Base64.urlCS);

    for (var i = 0; i < password.length; ++i) {
        result.push(password.charCodeAt(i) ^ key.charCodeAt(i));
    }

    return Base64.encode(result.join(''), Base64.urlCS).replace(/=+$/, '');
}

function script_load(url) {
    script_cancel();

    var script = document.body.appendChild(document.createElement('script'));
    script.setAttribute('id', SCRIPT_ID);
    script.setAttribute('src', url)
}

function script_cancel() {
    var script = document.getElementById(SCRIPT_ID);

    if (script) {
        script.parentNode.removeChild(script);
    }
}

function create_channel(buttom) {
    var id = String(++channel_id);
    channels[id] = { url: null, button: buttom, key: null, qr: null }
    script_load((window['SEQRENTRY_PROXY_URL'] || PROXY_URL) + 'create-proxy.js?ident=' + id);
}

function poll_channel(channel) {
    script_load(channel.url);
}

function close_all_channels() {
    channels = {};
    script_cancel();
}

function make_url(button, proxy, token, key) {
    var username;
    var realm = document.location.host;

    traverse_form(button, function(type, elem) {
        if (type == 'form') {
            realm = elem.getAttribute(REALM_ATTR) || realm;
        }
        else if (type == 'username') {
            username = elem.getAttribute(USERNAME_ATTR) || elem.value;
        }
    });

    return SEQRENTRY_URL + button.getAttribute(TYPE_ATTR) +
        '#p=' + encodeURIComponent(proxy) +
        '&t=' + encodeURIComponent(token) +
        '&r=' + encodeURIComponent(realm) +
        '&k=' + encodeURIComponent(key) +
        (username ? '&u=' + encodeURIComponent(username) : '')
}

function show_qr(channel) {
    var qrcode = new QRCode(10, QRErrorCorrectLevel.L);

    qrcode.addData(channel.qr);
    qrcode.make();

    var div = document.createElement('div');
    var can = document.createElement('canvas');

    div.id = BANNER_ID;
    div.style.top = (window.innerHeight - BANNER_HEIGHT) / 2 + 'px';
    div.title = 'Click to cancel';

    can.id = QRCODE_ID;
    can.title = 'Scan to activate!';

    can.width  = 350;
    can.height = 350;

    var ctx = can.getContext('2d');
    var dx  = can.width / qrcode.getModuleCount();
    var dy  = can.height / qrcode.getModuleCount();

    for (var y = 0; y < qrcode.getModuleCount(); ++y) {
        for (var x = 0; x < qrcode.getModuleCount(); ++x) {
            var xs = Math.round(x * dx), xe = Math.round(x * dx + dx);
            var ys = Math.round(y * dy), ye = Math.round(y * dy + dy);

            ctx.fillStyle = qrcode.isDark(y, x) ? '#000' : '#fff';
            ctx.fillRect(xs, ys, xe - xs, ye - ys);
        }
    }

    div.appendChild(can);
    document.body.insertBefore(div, document.body.firstChild);

    window.addEventListener('click', hide_qr, false);

    can.addEventListener('click', function(ev) {
        ev.stopPropagation();
        window.open(channel.qr);
    }, false);
}

function hide_qr() {
    // Remove QR banner and close all channels
    document.removeEventListener('click', hide_qr, false);

    var banner = document.getElementById(BANNER_ID);

    if (banner) {
        banner.parentNode.removeChild(banner);
    }
}

function traverse_form(elem, fn) {
    var form = elem.form;
    var f;

    while (!form && elem.parentNode) {
        elem = elem.parentNode;
        form = elem.form || ((elem.localName == 'form' || elem.getAttribute(TYPE_ATTR) == 'form') ? elem : null);
    }

    if (form) {
        fn('form', form);

        for (f = 0; f < form.length; ++f) {
            var type = form[f].getAttribute(TYPE_ATTR);

            if (type) {
	        fn(type, form[f]);
            }
        }
    }
}

SeQRentry['proxyCreated'] = function(status, params) {
    console.log('SeQRentry.proxyCreated', status, params);

    var id      = params['ident'];
    var proxy   = params['proxy'];
    var channel = channels[id];

    if (channel) {
        hide_qr();

        channel.key = Base64.encode(Random.randomString(16), Base64.urlCS).replace(/=+$/, '')
        channel.qr  = make_url(channel.button, proxy, params['token'], channel.key);
        channel.url = proxy + '.js' + '?ident=' + id + '&token=' + params['token'];

        show_qr(channel);
        poll_channel(channel);
    }
};

SeQRentry['proxyTimeout'] = function(status, params) {
    console.log('SeQRentry.proxyTimeout', status, params);

    var id      = params['ident'];
    var channel = channels[id];

    if (channel) {
        // Unless channel has been cancelled, poll it again
        poll_channel(channel);
    }
}

SeQRentry['proxyDeleted'] = SeQRentry['proxyNotFound'] = SeQRentry['proxyInUse'] = function(status, params) {
    console.log('SeQRentry.proxyDeleted/proxyNotFound/proxyInUse', status, params);

    var id      = params['ident'];
    var channel = channels[id];

    if (channel) {
        // Unless channel has been cancelled, create a new one and delete the old
        create_channel(channel.button);
        delete channels[id];
    }
}

SeQRentry['proxyResponse'] = function(status, params) {
    console.log('SeQRentry.proxyResponse', status, params);

    var id      = params['ident'];
    var channel = channels[id];

    if (channel) {
        hide_qr();

        close_all_channels();

        var form;

        traverse_form(channel.button, function(type, elem) {
            if (type == 'form') {
                form = elem;
            }
            else if (type == 'username') {
                elem.value = params['username'];
            }
            else if (type == 'password') {
                elem.value = decode_password(channel.key, params['password']);
            }
        });
    }
}

SeQRentry['install'] = function() {
    var tags = document.getElementsByTagName('*');
    var i, button_types = /^(register|change|login)$/;

    for (i = 0; i < tags.length; ++i) {
        // Is this a SeQRentry button container? If so, generate it
        if (button_types.test(tags[i].getAttribute(TYPE_ATTR))) {
	    install_button(tags[i]);
        }
    }
}
