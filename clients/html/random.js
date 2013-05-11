
var Random = {
  _entropy: "",
  _ritardandoState: {},

  init: function() {
    window.addEventListener('load', function load(ev){
      // Add DOM load time to entropy
      Random.addEntropy(ev.type);
    });

    window.addEventListener("scroll", function(ev) {
      Random.addRitardandoEntropy(ev.type, ev.type + ev.timeStamp + window.pageXOffset + window.pageYOffset);
    });

    window.addEventListener("mousemove", function(ev) {
      Random.addRitardandoEntropy(ev.type, ev.type + ev.clientX + ev.clientY + ev.screenX + ev.screenY + ev.timeStamp);
    });

    window.addEventListener("deviceorientation", function(ev) {
      Random.addRitardandoEntropy(ev.type, ev.type + ev.alpha + ev.beta + ev.gamma + ev.timeStamp);
    });

    window.addEventListener("devicemotion", function(ev) {
      var acc = ev.accelerationIncludingGravity;

      if (acc) {
	Random.addRitardandoEntropy(ev.type, ev.type + acc.x + acc.y + acc.x);
      }
    });

    window.addEventListener("keydown", function(ev) {
      Random.addRitardandoEntropy(ev.type, ev.type + ev.keyCode + ev.which + ev.timeStamp);
    });

    // Now add some entropy
    Random.addEntropy(navigator.userAgent + document.cookie +
		      window.innerWidth + window.innerHeight + window.screen.width + window.screen.height);

    // Add more entropy by serializing plugins, if possible (see https://panopticlick.eff.org/)
    var plugins = [], p, m, plug, mime;
    if (navigator.plugins) {
      for (p = 0; p < navigator.plugins.length; ++p) {
	plug = navigator.plugins[p];

	plugins.push(plug.description, plug.filename, plug.name, plug.version);

	for (m = 0; m < plug.length; ++m) {
	  mime = plug.item(m);

	  plugins.push(mime.description, mime.suffixes, mime.type);
	}
      }
    }

    Random.addEntropy(plugins.join(''));

    // Some browsers have a strong RNG -- use it if available
    try {
      var random = new Uint32Array(8); // 256 bits
      window.crypto.getRandomValues(random);
      Random.addEntropy(Array.apply([], random).toString());
    }
    catch (ignored) {}
  },

  // Gather entropy
  addEntropy: function(s) {
    // (The current time and a sample from Math.random() is always mixed in)
    Random._entropy = rstr_hmac_sha256(Random._entropy, s + new Date().getTime() + Math.random());
  },

  // Sample a lesser and lesser frequent 'random' selection of events
  addRitardandoEntropy: function(name, str) {
    var state = (Random._ritardandoState[name] = Random._ritardandoState[name] || { c: 0, m: 1 })

    if (++state.c >= state.m) {
      state.c = 0;
      state.m *= 1 + 0.5 * Math.random();

      Random.addEntropy(str);
    }
  },

  randomString: function(length) {
    var result = [], i, r;

    for (i = 0; i < length; ++i) {
      r = i % 16;

      result.push(String.fromCharCode((Math.round(255 * Math.random()) ^ Random._entropy.charCodeAt(r)) & 255));

      if (r == 15) {
	Random._entropy = Random._entropy.substring(16);
	Random.addEntropy("" + i);
      }
    }

    // Discard used entropy bytes
    Random._entropy = Random._entropy.substring(16);
    Random.addEntropy("");

    // Re-trigger frequent entropy gathering
    Random._ritardandoState = {};

    return result.join("");
  }
};

// Int entropy collector immediately
Random.init();
