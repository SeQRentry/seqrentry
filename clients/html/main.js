window['SeQRentry'] = {};

// Initialize everything when document is loaded

window.addEventListener('load', function load(ev){
    window.removeEventListener('load', load, false);
    SeQRentry['install']();
}, false);

/** @const */ var SCRIPT_ID     = 'seqrentry-script';
/** @const */ var BANNER_ID     = 'seqrentry-banner';
/** @const */ var QRCODE_ID     = 'seqrentry-qrcode';

/** @const */ var BANNER_HEIGHT = 440 + 4;

/** @const */ var TYPE_ATTR     = 'data-seqrentry-type';     // Element type: form|username|password|register|change|login
/** @const */ var REALM_ATTR    = 'data-seqrentry-realm';    // Authenticaiton realm
/** @const */ var USERNAME_ATTR = 'data-seqrentry-username'; // Override el.value
/** @const */ var FUNC_ATTR     = 'data-seqrentry-func';     // function(type, value) callback

/** @const */ var BUTTON_CLASS   = 'seqrentry-button';

/** @const */ var SEQRENTRY_URL = 'http://seqrentry.net/';
/** @const */ var PROXY_URL     = 'https://seqrentry.net/';

var channels   = /** @dict */ {}
var channel_id = 0;

function trim(str) {
    if (typeof str === 'string') {
        str = str.replace(/^\s+|\s+$/g, '');
    }

    return str;
}

function install_button(elem) {
    elem.className += ' ' + BUTTON_CLASS;
    elem.addEventListener('click', function(ev) {
        var register = false, username;

        ev.stopPropagation();

        traverse_form(elem, function(type, elem) {
            if (type == 'register') {
                register = true;
            }
            else if (type == 'form') {
                username = trim(elem.getAttribute(USERNAME_ATTR));
            }
            else if (type == 'username') {
                username = trim(elem.value);
            }
        });

        if (register && !username) {
            alert("No username");
        }
        else {
            show_banner(elem);
            create_channel(elem);
        }
    }, false);

    if (elem.localName == 'button' && !elem.hasAttribute('onclick')) {
	elem.setAttribute('onclick', 'return false;');
    }
}

// Derive XOR key based on derivation key and usage ('password', 'new-password' etc.)
function derive_key(key, type, length) {
    var result = "";
    var i = 0;

    while (result.length < length) {
        result += rstr_hmac_sha256(key, type + String(i));
        ++i;
    }

    return result.substring(0, length);
}

function decode_param(key, type, param) {
    var result = [];

    param = Base64.decode(param, Base64.urlCS);
    key   = derive_key(Base64.decode(key, Base64.urlCS), type, param.length);

    for (var i = 0; i < param.length; ++i) {
        result.push(String.fromCharCode(param.charCodeAt(i) ^ key.charCodeAt(i)));
    }

    return result.join('');
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

function create_channel(button) {
    var id = String(++channel_id);
    channels[id] = { url: null, button: button, key: null, qr: null }
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
    var realm = window['SEQRENTRY_REALM'] || document.location.host;

    traverse_form(button, function(type, elem) {
        if (type == 'form') {
            realm = elem.getAttribute(REALM_ATTR) || realm;
            username = trim(elem.getAttribute(USERNAME_ATTR));
        }
        else if (type == 'username') {
            username = trim(elem.value);
        }
    });

    return SEQRENTRY_URL + button.getAttribute(TYPE_ATTR) +
        '#p=' + encodeURIComponent(proxy) +
        '&t=' + encodeURIComponent(token) +
        '&r=' + encodeURIComponent(realm) +
        '&k=' + encodeURIComponent(key) +
        (username ? '&u=' + encodeURIComponent(username) : '')
}

function show_banner(button) {
    var div = document.createElement('div');

    div.id = BANNER_ID;
    div.style.top = (window.innerHeight - BANNER_HEIGHT) / 2 + 'px';
    div.title = 'Click to cancel';

    document.body.insertBefore(div, document.body.firstChild);

    var click_ev = 'ontouchstart' in window ? 'touchstart' : 'click';

    window.addEventListener(click_ev, function click_hide(ev) {
        window.removeEventListener(click_ev, click_hide, false);

        hide_banner();

        traverse_form(button, function(type, elem) {
            if (type == 'form') {
                call_func(type, elem, 'cancel');
                return false;
            }
        });

        close_all_channels();
    }, false);
}

function show_qr(channel) {
    var qrcode = new QRCode(10, QRErrorCorrectLevel.L);

    qrcode.addData(channel.qr);
    qrcode.make();

    var can = document.createElement('canvas');

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

    document.getElementById(BANNER_ID).appendChild(can);

    var click_ev = 'ontouchstart' in window ? 'touchstart' : 'click';

    can.addEventListener(click_ev, function(ev) {
        ev.stopPropagation();
        window.open(channel.qr);
    }, false);
}

function hide_banner() {
    // Remove QR banner
    var banner = document.getElementById(BANNER_ID);

    if (banner) {
        banner.parentNode.removeChild(banner);
    }
}

function hide_qr() {
    // Remove QR code
    var code = document.getElementById(QRCODE_ID);

    if (code) {
        code.parentNode.removeChild(code);
    }
}

function traverse_form(elem, fn) {
    var form = elem.form;
    var c, children;

    while (!form && elem.parentNode) {
        elem = elem.parentNode;
        form = elem.form || ((elem.localName == 'form' || elem.getAttribute(TYPE_ATTR) == 'form') ? elem : null);
    }

    if (form) {
        if (fn('form', form) !== false) {
            children = form.getElementsByTagName("*");

            for (c = 0; c < children.length; ++c) {
                var type = children[c].getAttribute(TYPE_ATTR);

                if (type) {
	            if (fn(type, children[c]) === false) {
                        break;
                    }
                }
            }
        }
    }
}

// Code to call the 'data-seqrentry-func' callback
function call_func(type, elem, value) {
    var rc = new Function('type', 'value', elem.getAttribute(FUNC_ATTR)).call(elem, type, value);
    var ev;

    if (rc !== null) {
        value = rc !== undefined ? rc : value;

        if (value !== undefined && value !== '') {
            elem.value = value;

            if ("fireEvent" in elem) {
                elem.fireEvent("onchange");
            }
            else {
                ev = document.createEvent("HTMLEvents");
                ev.initEvent("change", false, true);
                elem.dispatchEvent(ev);
            }
        }
    }
}

SeQRentry['proxyCreated'] = function(status, params) {
    var id      = params['ident'];
    var proxy   = params['proxy'];
    var channel = channels[id];

    console.log('SeQRentry.proxyCreated', status, params, channel);

    if (channel) {
        channel.key = Base64.encode(Random.randomString(16), Base64.urlCS).replace(/=+$/, '')
        channel.qr  = make_url(channel.button, proxy, params['token'], channel.key);
        channel.url = proxy + '.js' + '?ident=' + id + '&token=' + params['token'];

        show_qr(channel);

        traverse_form(channel.button, function(type, elem) {
            if (type == 'form') {
                call_func(type, elem, 'open');
                return false;
            }
        });

        poll_channel(channel);
    }
};

SeQRentry['proxyTimeout'] = function(status, params) {
    var id      = params['ident'];
    var channel = channels[id];

    console.log('SeQRentry.proxyTimeout', status, params, channel);

    if (channel) {
        // Unless channel has been cancelled, poll it again
        poll_channel(channel);
    }
}

SeQRentry['proxyDeleted'] = SeQRentry['proxyNotFound'] = SeQRentry['proxyInUse'] = function(status, params) {
    var id      = params['ident'];
    var channel = channels[id];

    console.log('SeQRentry.proxyDeleted/proxyNotFound/proxyInUse', status, params, channel);

    if (channel) {
        // Unless channel has been cancelled, create a new one and delete the old
        hide_qr();
        create_channel(channel.button);
        delete channels[id];
    }
}

SeQRentry['proxyResponse'] = function(status, params) {
    var id      = params['ident'];
    var channel = channels[id];

    console.log('SeQRentry.proxyResponse', status, params, channel);

    if (channel) {
        hide_banner();

        close_all_channels();

        var form;

        traverse_form(channel.button, function(type, elem) {
            if (type == 'form') {
                form = elem;
            }
            else {
                call_func(type, elem, decode_param(channel.key, type, params[type]));
            }
        });

        if (form) {
            call_func('form', form, 'success');
        }
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
