window['SeQRentry'] = {};

// Initialize everything when document is loaded

window.addEventListener('load', function load(ev){
  window.removeEventListener('load', load, false);
  SeQRentry['install']();

  Random.init();
  Random.addEntropy('' + new Date().getTime());

}, false);

var id_name   = 'data-seqrentry-id';
var type_name = 'data-seqrentry-type';

var buttons = {};
var button_id = 0;

function install_button(el) {
  var id   = el.getAttribute(id_name);
  var type = el.getAttribute(type_name);
  
  if (!id) {
    id = String(++button_id);
    buttons[id] = { el: el, href: null, channel: null };

    el.setAttribute(id_name, id);
    el.className += " seqrentry-button";
    el.innerHTML = "<img src='../SeQRentry-logo-v2-64.png' style='width: 100%;' />";
    el.addEventListener('click', function(ev) { ev.stopPropagation(); create_channel(id); }, false);
    
    if (el.localName == 'button' && !el.hasAttribute('onclick')) {
	el.setAttribute('onclick', 'return false;');
    }
  }
}

function decode_password(id, password) {
  var result = [];

  var key  = Base64.decode(buttons[id].key, Base64.urlCS);
  password = Base64.decode(password, Base64.urlCS);

  for (var i = 0; i < password.length; ++i) {
    result.push(password.charCodeAt(i) ^ key.charCodeAt(i));
  }

  return Base64.encode(result.join(''), Base64.urlCS).replace(/=+$/, '');
}

function script_load(url) {
  var script = document.getElementById('seqrentry-script');
  if (script) script.parentNode.removeChild(script);

  script = document.body.appendChild(document.createElement('script'));
  script.setAttribute('id', 'seqrentry-script');
  script.setAttribute('src', url)
}

function create_channel(id) {
  script_load((SEQRENTRY_PROXY_URL || 'http://seqrentry.net/') + 'create-proxy.js?ident=' + id);
}

function poll_channel(id) {
  script_load(buttons[id].channel);
}

function close_all_channels() {
  for (var i in buttons) {
    if (buttons[i].channel) {
      buttons[i].channel = null;
    }
  }

  console.log(buttons);
}

function make_url(id, proxy, token) {
  var username;
  var realm = document.location.host;

  traverse_form(id, function(type, elem) {
    if (type == 'form') {
      realm = elem.getAttribute('seqrentry-realm') || realm;
    }
    else if (type == 'username') {
      username = elem.value;
    }
  });

  return 'http://seqrentry.net/' + buttons[id].el.getAttribute(type_name) + 
    '#p=' + encodeURIComponent(proxy) +
    '&t=' + encodeURIComponent(token) +
    '&r=' + encodeURIComponent(realm) +
    '&k=' + buttons[id].key + 
    (username ? '&u=' + encodeURIComponent(username) : '')
}

function show_qr(id) {
  var qrcode = new QRCode(10, QRErrorCorrectLevel.L);

  qrcode.addData(buttons[id].href);
  qrcode.make();

  var div = document.createElement('div');
  var can = document.createElement('canvas');

  div.id = 'seqrentry-banner';
  div.style.top = (window.innerHeight - 400) / 2 + "px";
  div.title = 'Click to cancel';

  can.id = 'seqrentry-qrcode';
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
    window.open(buttons[id].href);
  }, false);
}

function hide_qr() {
  // Remove QR banner and close all channels

  var banner = document.getElementById('seqrentry-banner');

  if (banner) {
    document.removeEventListener('click', hide_qr, false);
    banner.parentNode.removeChild(banner);
  }

  close_all_channels();
}

function traverse_form(id, fn) {
  var elem = buttons[id].el;
  var form = elem.form;
  var f;

  while (!form && elem.parenNode) {
    elem = elem.parentNode;
    form = elem.form || ((elem.localName == 'form' || elem.getAttribute(type_name) == 'form') ? elem : null);
  }

  if (form) {
    fn('form', form);

    for (f = 0; f < form.length; ++f) {
      var type = form[f].getAttribute(type_name);

      if (type) {
	fn(type, form[f]);
      }
    }
  }
}

SeQRentry['proxyCreated'] = function(status, params) {
  console.log('SeQRentry.proxyCreated', status, params);

  var id = params['ident'];
  var proxy = params['proxy'];

  hide_qr();

  buttons[id].key  = Base64.encode(Random.randomString(16), Base64.urlCS).replace(/=+$/, '')
  buttons[id].href = make_url(id, proxy, params['token']);
  buttons[id].channel = proxy + '.js' + '?ident=' + id + '&token=' + params['token'];

  show_qr(id);
  poll_channel(id);
};

SeQRentry['proxyTimeout'] = function(status, params) {
  console.log('SeQRentry.proxyTimeout', status, params);

  var id = params['ident'];

  if (buttons[id].channel) {
    // Unless channel has been cancelled, poll it again
    poll_channel(id);
  }
}

SeQRentry['proxyDeleted'] = SeQRentry['proxyNotFound'] = SeQRentry['proxyInUse'] = function(status, params) {
  console.log('SeQRentry.proxyDeleted/proxyNotFound/proxyInUse', status, params);

  var id = params['ident'];

  if (buttons[id].channel) {
    // Unless channel has been cancelled, create a new one
    create_channel(id);
  }
}

SeQRentry['proxyResponse'] = function(status, params) {
  console.log('SeQRentry.proxyResponse', status, params);

  var id = params['ident'];

  hide_qr();

  var submit, form;

  traverse_form(id, function(type, elem) {
    if (type == 'form') {
      form = elem;
    }
    else if (type == 'submit') {
      submit = elem;
    }
    else if (type == 'username') {
      elem.value = params['username'];
    }
    else if (type == 'password') {
      elem.value = decode_password(id, params['password']);
    }
  });

  if (submit) {
    submit.click();
  }
  else if (form) {
    form.submit();
  }
}

SeQRentry['install'] = function() {
  var tags = document.getElementsByTagName('*');
  var i, button_types = /^(register|change|login)$/;

  for (i = 0; i < tags.length; ++i) {
    // Is this a SeQRentry button container? If so, generate it
    if (button_types.test(tags[i].getAttribute(type_name))) {
	install_button(tags[i]);
    }
  }
}
