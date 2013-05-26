window['SeQRentry'] = {};

// Initialize everything when document is loaded

var load = function(ev){
    ev = ev || window.event;
    remove_event('load', window, load);
    SeQRentry['install']();
};

add_event('load', window, load);

/** @const */ var SCRIPT_ID     = 'seqrentry-script';
/** @const */ var BANNER_ID     = 'seqrentry-banner';
/** @const */ var QRCODE_ID     = 'seqrentry-qrcode';

/** @const */ var BANNER_HEIGHT = 440 + 4;

/** @const */ var TYPE_ATTR     = 'data-seqrentry-type';     // Element type: form|username|password|register|change|login
/** @const */ var REALM_ATTR    = 'data-seqrentry-realm';    // Authenticaiton realm
/** @const */ var USERNAME_ATTR = 'data-seqrentry-username'; // Override el.value
/** @const */ var FUNC_ATTR     = 'data-seqrentry-func';     // function(type, value) callback

/** @const */ var BUTTON_CLASS   = 'seqrentry-button';
/** @const */ var BUTTON_IMAGE   = 'data:image/png;base64,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';

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
    if (!elem.hasChildNodes()) {
        var img = elem.appendChild(document.createElement('img'));
        img.className = BUTTON_CLASS;
        img.src       = BUTTON_IMAGE;
    }

    add_event('click', elem, function(ev) {
        ev = ev || window.event;
        var register = false, username;

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

	return stop_event(ev);
    });

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

    param = decodeURIComponent(escape(Base64.decode(param, Base64.urlCS))); // Decode Base64-encoded UTF-8 string
    key   = derive_key(Base64.decode(key, Base64.urlCS), type, param.length);

    for (var i = 0; i < param.length; ++i) {
        result.push(String.fromCharCode(param.charCodeAt(i) ^ key.charCodeAt(i)));
    }

    return result.join('');
}

function script_load(url) {
    script_cancel();

    window.setTimeout(function() {
        var where  = document.getElementsByTagName('script')[0];
        var script = where.parentNode.insertBefore(document.createElement('script'), where);
        script.setAttribute('id', SCRIPT_ID);
        script.setAttribute('src', url)
    }, 1);
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
    div.style.top = ((window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight) - BANNER_HEIGHT) / 2 + 'px';
    div.title = 'Click to cancel';

    document.body.insertBefore(div, document.body.firstChild);

    var click_ev = 'ontouchstart' in window ? 'touchstart' : 'click';
    var click_hide = function(ev) {
	ev = ev || window.event;
        remove_event(click_ev, document, click_hide);

        hide_banner();

        traverse_form(button, function(type, elem) {
            if (type == 'form') {
                call_func(type, elem, 'cancel');
                return false;
            }
        });

        close_all_channels();
    };

    add_event(click_ev, document, click_hide);
}

function show_qr(channel) {
    var qrcode = new QRCode(10, QRErrorCorrectLevel.L);

    qrcode.addData(channel.qr);
    qrcode.make();

    var can = document.createElement('canvas');

    if (can.getContext) {
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
    }
    else {
        can = document.createElement('div');
        var html = "<table>";

        for (var y = 0; y < qrcode.getModuleCount(); ++y) {
            html += "<tr>";
            for (var x = 0; x < qrcode.getModuleCount(); ++x) {
                html += "<td style='background: " + (qrcode.isDark(y, x) ? "#000" : "#fff") + ";'></td>";
            }
            html += "</tr>";
        }

        html += "</table>";
        can.innerHTML = html;
    }

    can.id = QRCODE_ID;
    can.title = 'Scan to activate!';

    document.getElementById(BANNER_ID).appendChild(can);

    var click_ev = 'ontouchstart' in window ? 'touchstart' : 'click';

    add_event(click_ev, can, function(ev) {
        ev = ev || window.event;
        window.open(channel.qr);
	return stop_event(ev);
    });
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

    if (rc !== null) {
        value = rc !== undefined ? rc : value;

        if (value !== undefined && value !== '') {
            elem.value = value;

            trigger_event("change", elem);
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
            else if (typeof params[type] !== "undefined") {
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
