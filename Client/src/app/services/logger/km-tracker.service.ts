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
export class KmTrackerService {
  isTracking = false;
  boundFunctions = [];

  user: any;

  constructor(
    private auth: AuthService,
    private storeService: StoreTrackService
  ) {}

  start() {
    if (!this.isTracking) {
      console.log('-----------------------------------');
      console.log('START KMtracking service');
      console.log('-----------------------------------');
      let targetDoc = window;

      let data = {
        w: window,
        d: document,
        e: document.documentElement,
        g: document.getElementsByTagName('body')[0],
      };

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
      /*Custom events*/
      this.bindEvent(targetDoc, 'openhelpmodal', data, this.openhelpmodalListener);
      this.bindEvent(targetDoc, 'closehelpmodal', data, this.closehelpmodalListener);
      this.bindEvent(targetDoc, 'changepage', data, this.changepageListener);
      this.bindEvent(targetDoc, 'previouspage', data, this.previouspageListener);
      this.bindEvent(targetDoc, 'nextpage', data, this.nextpageListener);
      this.bindEvent(targetDoc, 'changetowebpagestab', data, this.changetowebpagestabListener);
      this.bindEvent(targetDoc, 'changetoimagestab', data, this.changetoimagestabListener);
      this.bindEvent(targetDoc, 'changetovideostab', data, this.changetovideostabListener);
      /*End custom events*/
      this.isTracking = true;
    }
  }

  stop() {
    if (this.isTracking) {
      console.log('-----------------------------------');
      console.log('STOP KMtracking service');
      console.log('-----------------------------------');
      let targetDoc = window;

      let data = {
        w: window,
        d: document,
        e: document.documentElement,
        g: document.getElementsByTagName('body')[0],
      };

      this.unbindAll(targetDoc, 'mousemove');
      this.unbindAll(targetDoc, 'scroll');
      this.unbindAll(targetDoc, 'click');
      this.unbindAll(targetDoc, 'keydown');
      this.unbindAll(targetDoc, 'keypress');
      this.unbindAll(targetDoc, 'keyup');
      /*Custom events*/
      this.unbindAll(targetDoc, 'openhelpmodal');
      this.unbindAll(targetDoc, 'closehelpmodal');
      this.unbindAll(targetDoc, 'changepage');
      this.unbindAll(targetDoc, 'previouspage');
      this.unbindAll(targetDoc, 'nextpage');
      this.unbindAll(targetDoc, 'changetowebpagestab');
      this.unbindAll(targetDoc, 'changetoimagestab');
      this.unbindAll(targetDoc, 'changetovideostab');
      /*End custom events*/
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
      time = Date.now();

    let docX = evt.pageX,
      docY = evt.pageY,
      winX = evt.clientX,
      winY = evt.clientY,
      docW = doc.body.clientWidth,
      docH = doc.body.clientHeight,
      winW = w,
      winH = h;

    let clickOutput = {
      userId: this.user.id,
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
      source: 'Window',
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
      source: 'Window',
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
      source: 'Window',
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

  openhelpmodalListener(evt){
    evt = evt || event;

    let t = Date.now(),
    doc = evt.currentTarget.data.d;

    let keyOutput = {
      userId: this.user.id,
      source: 'HelpModal',
      type: 'OpenHelpModal',
      localTimestamp: t,
      url: doc.URL,
    };

    // console.log(keyOutput);
    evt.currentTarget.storeService.postEvent(keyOutput);
  }

  closehelpmodalListener(evt){
    evt = evt || event;

    let t = Date.now(),
    doc = evt.currentTarget.data.d;

    let keyOutput = {
      userId: this.user.id,
      source: 'HelpModal',
      type: 'CloseHelpModal',
      localTimestamp: t,
      url: doc.URL,
    };

    // console.log(keyOutput);
    evt.currentTarget.storeService.postEvent(keyOutput);
  }   
  
  changepageListener(evt){
    evt = evt || event;

    let t = Date.now(),
    doc = evt.currentTarget.data.d;

    let keyOutput = {
      userId: this.user.id,
      source: 'Pagination',
      type: 'ChangePage',
      localTimestamp: t,
      url: doc.URL,
      detail: evt.detail
    };

    // console.log(keyOutput);
    evt.currentTarget.storeService.postEvent(keyOutput);
  }      

  previouspageListener(evt){
    evt = evt || event;

    let t = Date.now(),
    doc = evt.currentTarget.data.d;

    let keyOutput = {
      userId: this.user.id,
      source: 'Pagination',
      type: 'PreviousPage',
      localTimestamp: t,
      url: doc.URL,
      detail: evt.detail
    };

    // console.log(keyOutput);
    evt.currentTarget.storeService.postEvent(keyOutput);
  }
  
  nextpageListener(evt){
    evt = evt || event;

    let t = Date.now(),
    doc = evt.currentTarget.data.d;

    let keyOutput = {
      userId: this.user.id,
      source: 'Pagination',
      type: 'NextPage',
      localTimestamp: t,
      url: doc.URL,
      detail: evt.detail
    };

    // console.log(keyOutput);
    evt.currentTarget.storeService.postEvent(keyOutput);
  }

  changetowebpagestabListener(evt){
    evt = evt || event;

    let t = Date.now(),
    doc = evt.currentTarget.data.d;

    let keyOutput = {
      userId: this.user.id,
      source: 'SearchResultsTabs',
      type: 'ChangeToWebPagesTab',
      localTimestamp: t,
      url: doc.URL,
    };

    // console.log(keyOutput);
    evt.currentTarget.storeService.postEvent(keyOutput);
  } 
  
  changetoimagestabListener(evt){
    evt = evt || event;

    let t = Date.now(),
    doc = evt.currentTarget.data.d;

    let keyOutput = {
      userId: this.user.id,
      source: 'SearchResultsTabs',
      type: 'ChangeToImagesTab',
      localTimestamp: t,
      url: doc.URL,
    };

    // console.log(keyOutput);
    evt.currentTarget.storeService.postEvent(keyOutput);
  }
  
  changetovideostabListener(evt){
    evt = evt || event;

    let t = Date.now(),
    doc = evt.currentTarget.data.d;

    let keyOutput = {
      userId: this.user.id,
      source: 'SearchResultsTabs',
      type: 'ChangeToVideosTab',
      localTimestamp: t,
      url: doc.URL,
    };

    // console.log(keyOutput);
    evt.currentTarget.storeService.postEvent(keyOutput);
  }  

  mouseMoveListener(evt) {
    // From http://stackoverflow.com/a/23323821
    let win = evt.currentTarget.data.w,
      doc = evt.currentTarget.data.d,
      elm = evt.currentTarget.data.e,
      gtb = evt.currentTarget.data.g,
      w = window.innerWidth || elm.clientWidth || gtb.clientWidth,
      h = window.innerHeight || elm.clientHeight || gtb.clientHeight,
      time = Date.now();

    let docX = evt.pageX,
      docY = evt.pageY,
      winX = evt.clientX,
      winY = evt.clientY,
      docW = doc.body.clientWidth,
      docH = doc.body.clientHeight,
      winW = w,
      winH = h;

    let movementOutput = {
      userId: this.user.id,
      type: 'MouseMovement',
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
      time = Date.now();

    let scrollX = window.scrollX,
      scrollY = window.scrollY,
      docW = doc.body.clientWidth,
      docH = doc.body.clientHeight,
      winW = w,
      winH = h;

    let scrollOutput = {
      userId: this.user.id,
      type: 'Scroll',
      source: 'Window',
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
