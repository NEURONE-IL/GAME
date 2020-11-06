import { Injectable } from '@angular/core';

 /*
 * Keyboard and mouse tracker service.
 * Adapted for Angular based on the
 * original work of Daniel Gacitua <daniel.gacitua@usach.cl>
 * https://github.com/NEURONE-IL/neurone
 */

@Injectable({
  providedIn: 'root'
})
export class KmTrackerService {

    isTracking = false;
    window = window;
    document = document;

  constructor() { }

  startTrack() {
    let targetDoc = window;

    let data = {
      w: this.window,
      d: this.document,
      e: this.document.documentElement,
      g: document.getElementsByTagName('body')[0],
      s: 'state'
    };

    console.log(data);

    // this.bindThrottledEvent(targetDoc, 'mousemove', data, this.mouseMoveListener, LoggerConfigs.eventThrottle);
    // this.bindThrottledEvent(targetDoc, 'scroll', data, this.scrollListener, LoggerConfigs.eventThrottle);
    this.bindEvent(targetDoc, 'click', data, this.mouseClickListener);
    // this.bindEvent(targetDoc, 'keydown', data, this.keydownListener);
    // this.bindEvent(targetDoc, 'keypress', data, this.keypressListener);
    // this.bindEvent(targetDoc, 'keyup', data, this.keyupListener);

    this.isTracking = true;
  }

  bindEvent(elem, evt, data, fn) {
    elem.addEventListener(evt, fn);
    elem.data = data;
    console.log('Bind!')
  }

  mouseClickListener(evt) {
    if (true) {
      // From http://stackoverflow.com/a/11744120/1319998
      let win = evt.currentTarget.data.w,
          doc = evt.currentTarget.data.d,
          elm = evt.currentTarget.data.e,
          gtb = evt.currentTarget.data.g,
          w = window.innerWidth  || elm.clientWidth  || gtb.clientWidth,
          h = window.innerHeight || elm.clientHeight || gtb.clientHeight,
          // s = evt.currentTarget.data.s,
          // src = s.href(s.current.name, s.params, {absolute: false}),
          src = 'pendiente',
          time = 'pendiente';

      let docX = evt.pageX,
          docY = evt.pageY,
          winX = evt.clientX,
          winY = evt.clientY,
          // docW = doc.width(),
          // docH = doc.height(),
          docW = 'pendiente',
          docH = 'pendiente',
          winW = w,
          winH = h;

      let clickOutput = {
        userId: 'user Id',
        username: 'username',
        type: 'MouseClick',
        source: 'Window',
        url: doc.URL,
        x_win: winX,
        y_win: winY,
        w_win: winW,
        h_win: winH,
        x_doc: docX,
        y_doc: docY,
        w_doc: docW,
        h_doc: docH,
        localTimestamp: time
      };
      console.log(clickOutput);
      // Save clickOutput here
    }
  }
}
