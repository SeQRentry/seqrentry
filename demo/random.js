
var Random = {
  _entropy: "",
  _ritardandoState: {},

  init: function() {
    window.addEventListener("mousemove", function load(ev) {
      Random.addRitardandoEntropy("mousemove", "" + ev.clientX + ev.clientY + ev.screenX + ev.screenY + ev.timeStamp);
    });

    window.addEventListener("deviceorientation", function load(ev) {
      Random.addRitardandoEntropy("deviceorientation", "" + ev.alpha + ev.beta + ev.gamma + ev.timeStamp);
    });

    window.addEventListener("devicemotion", function load(ev) {
      var acc = ev.accelerationIncludingGravity;
      
      if (acc) {
	Random.addRitardandoEntropy("devicemotion", "" + acc.x + acc.y + acc.x);
      }
    });

    window.addEventListener("keydown", function load(ev) {
      Random.addRitardandoEntropy("keydown", "" + ev.keyCode + ev.which + ev.timeStamp);
    });
  },

  // Gather entropy
  addEntropy: function(s) {
    Random._entropy = rstr_sha256(Random._entropy + s);
    console.log(s, Random._entropy, Base64.encode(Random._entropy, Base64.urlCS));
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

  randomString: function(lenth) {
    var result = [], i, r;

    for (i = 0; i < length; ++i) {
      r = i % 16;

      result.push(String.fromCharCode((Math.round(255 * Math.random()) ^ entropy.charCodeAt(r)) & 255));

      if (r == 15) {
	Random._entropy = Random._entropy.substring(16);
	Random.addEntropy("" + i);
      }
    }

    // Discard used entropy bytes
    Random._entropy = Random._entropy.substring(16);
    Random.addEntropy("" + new Date().getTime());

    // Re-trigger frequent entropy gathering
    Random._ritardandoState = {};

    return result.join("");
  }
};
