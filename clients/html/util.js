// Wrappers to handle old MSIE
function add_event(ev, elem, func) {
    if (elem.addEventListener) {
	elem.addEventListener(ev, func, false);
    }
    else if (elem.attachEvent) {
	elem.attachEvent("on" + ev, func);
    }
}

function remove_event(ev, elem, func) {
    if (elem.removeEventListener) {
	elem.removeEventListener(ev, func, false);
    }
    else if (elem.detachEvent) {
	elem.detachEvent("on" + ev, func) 
    }
}

function trigger_event(ev, elem) {
  var evobj;

  if (document.createEvent) {
    evobj = document.createEvent("HTMLEvents");
    evobj.initEvent(ev, false, true);
    elem.dispatchEvent(evobj);
  }
  else if (elem.fireEvent) {
    try {
      evobj = document.createEventObject();
      elem.fireEvent("on" + ev, evobj);
    }
    catch (ex) {
      console.log("trigger_event " + ev + " on " + elem + " failed: " + ex);
    }
  }
}

function stop_event(ev) {
    if (ev.stopPropagation) {
	ev.stopPropagation();
    }
    else {
	ev.cancelBubble = true;
    }

    if (ev.preventDefault) {
	ev.preventDefault();
    }
    else {
	ev.returnValue = false;
    }
 
    return false;
}