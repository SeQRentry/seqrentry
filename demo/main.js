window['SeQRentry'] = {};


// Initialize everything when document is loaded

window.addEventListener("load", function load(ev){
  window.removeEventListener("load", load, false);
  SeQRentry['install']();

  add_entropy(navigator.userAgent + document.cookie + 
	      init_time + new Date().getTime() + 
	      window.innerWidth + window.innerHeight + window.screen.width + window.screen.height);

  window.addEventListener("mousemove", function load(ev) {
    add_mouse_entropy("mousemove", "" + ev.clientX + ev.clientY + ev.screenX + ev.screenY + ev.timeStamp);
  });

  window.addEventListener("deviceorientation", function load(ev) {
    add_mouse_entropy("deviceorientation", "" + ev.alpha + ev.beta + ev.gamma + ev.timeStamp);
  });

  window.addEventListener("devicemotion", function load(ev) {
    var acc = ev.accelerationIncludingGravity;

    if (acc) {
      add_mouse_entropy("devicemotion", "" + acc.x + acc.y + acc.x);
    }
  });
}, false);

// Gather entropy for encryption
var init_time = new Date().getTime();
var entropy = "";
var mouse_state = {}

function add_entropy(s) {
  entropy = rstr_sha256(entropy + s);
  console.log(entropy);
}

function add_mouse_entropy(name, str) {
  var state = (mouse_state[name] = mouse_state[name] || { c: 0, m: 1 })

  if (++state.c >= state.m) {
    // Sample a 'random' selection of mouse events
    state.c = 0;
    state.m *= 1 + 0.5 * Math.random();

    add_entropy(str);
  }
}


var id_name   = "data-seqrentry-id";
var type_name = "data-seqrentry-type";

var buttons = {};
var button_id = 0;

function install_button(el) {
  var id   = el.getAttribute(id_name);
  var type = el.getAttribute(type_name);
  
  if (!id) {
    id = String(++button_id);
    buttons[id] = { el: el, href: null, channel: null };

    el.setAttribute(id_name, id);
    el.innerHTML = "<img src='../SeQRentry-logo-64.png' style='width: 100%;' />";
    el.addEventListener("click", function(ev) { ev.stopPropagation(); click_handler(id); }, false);
    
    if (el.localName == "button" && !el.hasAttribute("onclick")) {
	el.setAttribute("onclick", "return false;");
    }
  }
}

function enter_data(el, username, password) {
}

function click_handler(id) {
  if (!buttons[id].href)  {
    create_channel(id);
  }
  else {
    window.open(buttons[id].href);
  }
}

function script_load(url) {
  var script = document.getElementById('seqrentry-script');
  if (script) script.parentNode.removeChild(script);

  script = document.body.appendChild(document.createElement("script"));
  script.setAttribute("id", "seqrentry-script");
  script.setAttribute("src", url)
}

function create_channel(id) {
  script_load((SEQRENTRY_PROXY_URL || "http://seqrentry.net/") + "create-proxy.js?ident=" + id);
}

function poll_channel(id) {
  script_load(buttons[id].channel);
}

function make_url(id, proxy, token) {
  return "http://seqrentry.net/" + buttons[id].el.getAttribute(type_name) + 
    "#p=" + encodeURIComponent(proxy) +
    "&t=" + encodeURIComponent(token);
}

function make_qr(id) {
  var qrcode= new QRCode(10, QRErrorCorrectLevel.L);
  qrcode.addData(buttons[id].href);
  qrcode.make();

  var table = "<table style='margin: 0px; padding: 3px; width: 80px; height: 80px; border: 0px; border-collapse: collapse; background-color: #fff'>";

  for (var y = 0; y < qrcode.getModuleCount(); ++y) {
    table += "<tr style='height: 1px;'>";

    for (var x = 0; x < qrcode.getModuleCount(); ++x) {
	table += "<td" + (qrcode.isDark(y, x) ? " style='background-color: #000;'></td>" : "></td>");
    }

    table += "</tr>";
  }

  return table;
}

SeQRentry['proxyCreated'] = function(status, params) {
  console.log("SeQRentry.proxyCreated", status, params);

  var id = params['ident'];

  buttons[id].href = make_url(id, params['proxy'], params['token']);
  buttons[id].el.innerHTML = make_qr(id);
  buttons[id].channel = params['proxy'] + "?ident=" + params['ident'] + "&token=" + params['token'];

  poll_channel(id);
};

SeQRentry['proxyTimeout'] = function(status, params) {
  console.log("SeQRentry.proxyTimeout", status, params);

  poll_channel(params['ident']);
}

SeQRentry['proxyDeleted'] = SeQRentry['proxyNotFound'] = SeQRentry['proxyInUse'] = function(status, params) {
  console.log("SeQRentry.proxyDeleted/proxyNotFound/proxyInUse", status, params);

  create_channel(params['ident']);
}

SeQRentry['proxyResponse'] = function(status, params) {
  console.log("SeQRentry.proxyResponse", status, params);

  var id = params['ident'];

  buttons[id].el.innerHTML = "<img src='../SeQRentry-logo-64.png' style='width: 100%;' />";
  buttons[id].href = null;
  buttons[id].channel = null;
}

SeQRentry['install'] = function() {
  var tags = document.getElementsByTagName("*");
  var i, button_types = /^(register|change|login)$/;

  for (i = 0; i < tags.length; ++i) {
    // Is this a SeQRentry button container? If so, generate it
    if (button_types.test(tags[i].getAttribute(type_name))) {
	install_button(tags[i]);
    }
  }
}
