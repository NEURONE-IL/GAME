import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { AuthService } from '../auth/auth.service';
import { StoreTrackService } from './store-track.service';

/*
 * Keyboard and mouse tracker service.
 * Adapted for Angular based on the
 * original work of Daniel Gacitua <daniel.gacitua@usach.cl>
 * https://github.com/NEURONE-IL/neurone
 */

@Injectable({
  providedIn: 'root',
})
export class KmTrackerServiceIframe {
  isTracking = false;
  boundFunctions = [];

  user: any;

  constructor(
    private storeService: StoreTrackService,
    private auth: AuthService
  ) {}

  start() {
    if (!this.isTracking) {
      console.log('-----------------------------------');
      console.log('START KMtracking Iframe service');
      console.log('-----------------------------------');
      let targetDoc: any;

      let data = {
        w: window,
        d: document,
        e: document.documentElement,
        g: document.getElementsByTagName('body')[0],
      };

      targetDoc =
        document.getElementById('result-iframe') ||
        document.getElementsByTagName('iframe')[0];

      targetDoc = targetDoc.contentWindow.document;

      this.bindThrottledEvent(
        targetDoc,
        'mousemove',
        data,
        this.mouseMoveListener,
        250
      );
      this.bindThrottledEvent(
        targetDoc,
        'scroll',
        data,
        this.scrollListener,
        250
      );
      this.bindEvent(targetDoc, 'click', data, this.mouseClickListener);
      this.bindEvent(targetDoc, 'keydown', data, this.keydownListener);
      this.bindEvent(targetDoc, 'keypress', data, this.keypressListener);
      this.bindEvent(targetDoc, 'keyup', data, this.keyupListener);

      this.isTracking = true;
    }
  }

  stop() {
    if (this.isTracking) {
      console.log('-----------------------------------');
      console.log('STOP KMtracking Iframe service');
      console.log('-----------------------------------');
      let targetDoc: any;

      targetDoc =
        document.getElementById('result-iframe') ||
        document.getElementsByTagName('iframe')[0];

      this.unbindAll(targetDoc, 'mousemove');
      this.unbindAll(targetDoc, 'scroll');
      this.unbindAll(targetDoc, 'click');
      this.unbindAll(targetDoc, 'keydown');
      this.unbindAll(targetDoc, 'keypress');
      this.unbindAll(targetDoc, 'keyup');
      this.unbindData(targetDoc);

      this.isTracking = false;
    }
  }

  bindEvent(elem, evt, data, fn) {
    this.boundFunctions.push(fn);
    elem.addEventListener(evt, fn);
    elem.data = data;
    elem.storeService = this.storeService;
    this.user = {
      id: this.auth.getUser()._id,
      email: this.auth.getUser().email,
    }
    elem.user = this.user;
  }

  bindThrottledEvent(elem, evt, data, fn, delay) {
    const throttledFn = _.throttle(fn, delay, { trailing: false });
    this.boundFunctions.push(throttledFn);
    elem.addEventListener(evt, throttledFn);
    elem.data = data;
    elem.storeService = this.storeService;
    this.user = {
      id: this.auth.getUser()._id,
      email: this.auth.getUser().email,
    }
    elem.user = this.user;
  }

  unbindAll(elem, evt) {
    this.boundFunctions.forEach((boundFn) => {
      elem.removeEventListener(evt, boundFn);
    });
  }

  unbindData(elem) {
    delete elem.data;
    delete elem.storeService;
  }

  mouseClickListener(evt) {
    // From http://stackoverflow.com/a/11744120/1319998
    let win = evt.currentTarget.data.w,
      doc = evt.currentTarget.data.d,
      elm = evt.currentTarget.data.e,
      gtb = evt.currentTarget.data.g,
      w = window.innerWidth || elm.clientWidth || gtb.clientWidth,
      h = window.innerHeight || elm.clientHeight || gtb.clientHeight,
      ifm =
        document.getElementById('result-iframe') ||
        document.getElementsByTagName('iframe')[0],
      time = Date.now();

    let docX = evt.pageX,
      docY = evt.pageY,
      winX = evt.clientX,
      winY = evt.clientY,
      // docW = doc.body.clientWidth,
      // docH = doc.body.clientHeight,
      docW = ifm.clientWidth,
      docH = ifm.clientHeight,
      winW = w,
      winH = h;

    const isIFrame = (input: HTMLElement | null): input is HTMLIFrameElement =>
      input !== null && input.tagName === 'IFRAME';

    if (isIFrame(ifm) && ifm.contentWindow) {
      docW = ifm.contentDocument.body.scrollWidth;
      docH = ifm.contentDocument.body.scrollHeight;
    }

    let clickOutput = {
      userId: this.user.id,
      type: 'MouseClick',
      source: 'Iframe',
      url: doc.URL,
      x_win: winX,
      y_win: winY,
      w_win: winW,
      h_win: winH,
      x_doc: docX,
      y_doc: docY,
      w_doc: docW,
      h_doc: docH,
      localTimestamp: time,
    };
    // console.log(clickOutput);
    evt.currentTarget.storeService.postMouseClick(clickOutput);
  }

  keydownListener(evt) {
    evt = evt || event;

    let t = Date.now(),
      w = evt.which,
      kc = evt.keyCode,
      chc = evt.charCode,
      key = evt.key || '',
      chr = String.fromCharCode(kc || chc),
      doc = evt.currentTarget.data.d;

    let keyOutput = {
      userId: this.user.id,
      type: 'KeyDown',
      source: 'Iframe',
      which: w,
      keyCode: kc,
      charCode: chc,
      key: key,
      chr: chr,
      localTimestamp: t,
      url: doc.URL,
    };
    // console.log(keyOutput);
    evt.currentTarget.storeService.postKeyStroke(keyOutput);
  }

  keyupListener(evt) {
    evt = evt || event;

    let t = Date.now(),
      w = evt.which,
      kc = evt.keyCode,
      chc = evt.charCode,
      key = evt.key || '',
      chr = String.fromCharCode(kc || chc),
      doc = evt.currentTarget.data.d;

    let keyOutput = {
      userId: this.user.id,
      type: 'KeyUp',
      source: 'Iframe',
      which: w,
      keyCode: kc,
      charCode: chc,
      key: key,
      chr: chr,
      localTimestamp: t,
      url: doc.URL,
    };

    // console.log(keyOutput);
    evt.currentTarget.storeService.postKeyStroke(keyOutput);
  }

  keypressListener(evt) {
    evt = evt || event;

    let t = Date.now(),
      w = evt.which,
      kc = evt.keyCode,
      chc = evt.charCode,
      key = evt.key || '',
      chr = String.fromCharCode(kc || chc),
      doc = evt.currentTarget.data.d;

    let keyOutput = {
      userId: this.user.id,
      type: 'KeyPress',
      source: 'Iframe',
      which: w,
      keyCode: kc,
      charCode: chc,
      key: key,
      chr: chr,
      localTimestamp: t,
      url: doc.URL,
    };

    // console.log(keyOutput);
    evt.currentTarget.storeService.postKeyStroke(keyOutput);
  }

  mouseMoveListener(evt) {
    // From http://stackoverflow.com/a/23323821
    let win = evt.currentTarget.data.w,
      doc = evt.currentTarget.data.d,
      elm = evt.currentTarget.data.e,
      gtb = evt.currentTarget.data.g,
      w = window.innerWidth || elm.clientWidth || gtb.clientWidth,
      h = window.innerHeight || elm.clientHeight || gtb.clientHeight,
      ifm =
        document.getElementById('result-iframe') ||
        document.getElementsByTagName('iframe')[0],
      time = Date.now();

    let docX = evt.pageX,
      docY = evt.pageY,
      winX = evt.clientX,
      winY = evt.clientY,
      // docW = doc.body.clientWidth,
      // docH = doc.body.clientHeight,
      docW = ifm.clientWidth,
      docH = ifm.clientHeight,
      winW = w,
      winH = h;

    const isIFrame = (input: HTMLElement | null): input is HTMLIFrameElement =>
      input !== null && input.tagName === 'IFRAME';

    if (isIFrame(ifm) && ifm.contentWindow) {
      docW = ifm.contentDocument.body.scrollWidth;
      docH = ifm.contentDocument.body.scrollHeight;
    }

    let movementOutput = {
      userId: this.user.id,
      type: 'MouseMovement',
      source: 'Iframe',
      url: doc.URL,
      x_win: winX,
      y_win: winY,
      w_win: winW,
      h_win: winH,
      x_doc: docX,
      y_doc: docY,
      w_doc: docW,
      h_doc: docH,
      localTimestamp: time,
    };

    // console.log(movementOutput);
    evt.currentTarget.storeService.postMouseCoordinates(movementOutput);
  }

  scrollListener(evt) {
    // From http://stackoverflow.com/a/23323821
    let win = evt.currentTarget.data.w,
      doc = evt.currentTarget.data.d,
      elm = evt.currentTarget.data.e,
      gtb = evt.currentTarget.data.g,
      w = window.innerWidth || elm.clientWidth || gtb.clientWidth,
      h = window.innerHeight || elm.clientHeight || gtb.clientHeight,
      ifm =
        document.getElementById('result-iframe') ||
        document.getElementsByTagName('iframe')[0],
      time = Date.now();

    let scrollX = ifm.scrollLeft,
      scrollY = ifm.scrollTop,
      docW = ifm.clientWidth,
      docH = ifm.clientHeight,
      winW = w,
      winH = h;

    const isIFrame = (input: HTMLElement | null): input is HTMLIFrameElement =>
      input !== null && input.tagName === 'IFRAME';

    if (isIFrame(ifm) && ifm.contentWindow) {
      docW = ifm.contentDocument.body.scrollWidth;
      docH = ifm.contentDocument.body.scrollHeight;
      scrollX = ifm.contentWindow.scrollX;
      scrollY = ifm.contentWindow.scrollY;
    }

    let scrollOutput = {
      userId: this.user.id,
      type: 'Scroll',
      source: 'Iframe',
      url: doc.URL,
      x_scr: scrollX,
      y_scr: scrollY,
      w_win: winW,
      h_win: winH,
      w_doc: docW,
      h_doc: docH,
      localTimestamp: time,
    };
    // console.log(scrollOutput);
    evt.currentTarget.storeService.postScroll(scrollOutput);
  }
}
