import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { StoreTrackService } from './store-track.service';

@Injectable({
  providedIn: 'root'
})
export class ActionsTrackerService {
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
      console.log('START ActionsTracking service');
      console.log('-----------------------------------');
      let targetDoc = window;

      let data = {
        w: window,
        d: document,
        e: document.documentElement,
        g: document.getElementsByTagName('body')[0],
      };

      /*Custom events*/
      this.bindEvent(targetDoc, 'openhelpmodal', data, this.openhelpmodalListener);
      this.bindEvent(targetDoc, 'closehelpmodal', data, this.closehelpmodalListener);
      this.bindEvent(targetDoc, 'changepage', data, this.changepageListener);
      this.bindEvent(targetDoc, 'previouspage', data, this.previouspageListener);
      this.bindEvent(targetDoc, 'nextpage', data, this.nextpageListener);
      this.bindEvent(targetDoc, 'changetowebpagestab', data, this.changetowebpagestabListener);
      this.bindEvent(targetDoc, 'changetoimagestab', data, this.changetoimagestabListener);
      this.bindEvent(targetDoc, 'changetovideostab', data, this.changetovideostabListener);
      this.bindEvent(targetDoc, 'showquestionbar', data, this.showquestionbarListener);
      this.bindEvent(targetDoc, 'hidequestionbar', data, this.hidequestionbarListener);
      this.bindEvent(targetDoc, 'markfavoritepage', data, this.markfavoritepageListener);
      this.bindEvent(targetDoc, 'unmarkfavoritepage', data, this.unmarkfavoritepageListener);      
      /*End custom events*/
      this.isTracking = true;
    }
  }

  stop() {
    if (this.isTracking) {
      console.log('-----------------------------------');
      console.log('STOP ActionsTracking service');
      console.log('-----------------------------------');
      let targetDoc = window;

      /*Custom events*/
      this.unbindAll(targetDoc, 'openhelpmodal');
      this.unbindAll(targetDoc, 'closehelpmodal');
      this.unbindAll(targetDoc, 'changepage');
      this.unbindAll(targetDoc, 'previouspage');
      this.unbindAll(targetDoc, 'nextpage');
      this.unbindAll(targetDoc, 'changetowebpagestab');
      this.unbindAll(targetDoc, 'changetoimagestab');
      this.unbindAll(targetDoc, 'changetovideostab');
      this.unbindAll(targetDoc, 'showquestionbar');
      this.unbindAll(targetDoc, 'hidequestionbar');
      this.unbindAll(targetDoc, 'markfavoritepage');
      this.unbindAll(targetDoc, 'unmarkfavoritepage');
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
      study: this.auth.getUser().study
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

  openhelpmodalListener(evt){
    evt = evt || event;

    let t = Date.now(),
    doc = evt.currentTarget.data.d;

    let keyOutput = {
      userId: this.user.id,
      studyId: this.user.study,
      challengeId: localStorage.getItem('chall'),
      source: 'HelpModal',
      type: 'OpenHelpModal',
      localTimeStamp: t,
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
      studyId: this.user.study,
      challengeId: localStorage.getItem('chall'),
      source: 'HelpModal',
      type: 'CloseHelpModal',
      localTimeStamp: t,
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
      studyId: this.user.study,
      challengeId: localStorage.getItem('chall'),
      source: 'Pagination',
      type: 'ChangePage',
      localTimeStamp: t,
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
      studyId: this.user.study,
      challengeId: localStorage.getItem('chall'),
      source: 'Pagination',
      type: 'PreviousPage',
      localTimeStamp: t,
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
      studyId: this.user.study,
      challengeId: localStorage.getItem('chall'),
      source: 'Pagination',
      type: 'NextPage',
      localTimeStamp: t,
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
      studyId: this.user.study,
      challengeId: localStorage.getItem('chall'),
      source: 'SearchResultsTabs',
      type: 'ChangeToWebPagesTab',
      localTimeStamp: t,
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
      studyId: this.user.study,
      challengeId: localStorage.getItem('chall'),
      source: 'SearchResultsTabs',
      type: 'ChangeToImagesTab',
      localTimeStamp: t,
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
      studyId: this.user.study,
      challengeId: localStorage.getItem('chall'),
      source: 'SearchResultsTabs',
      type: 'ChangeToVideosTab',
      localTimeStamp: t,
      url: doc.URL,
    };

    // console.log(keyOutput);
    evt.currentTarget.storeService.postEvent(keyOutput);
  }  

  showquestionbarListener(evt){
    evt = evt || event;

    let t = Date.now(),
    doc = evt.currentTarget.data.d;

    let keyOutput = {
      userId: this.user.id,
      source: 'QuestionBar',
      type: 'ShowQuestionBar',
      localTimeStamp: t,
      url: doc.URL,
      detail: evt.detail
    };

    // console.log(keyOutput);
    evt.currentTarget.storeService.postEvent(keyOutput);
  }
  
  hidequestionbarListener(evt){
    evt = evt || event;

    let t = Date.now(),
    doc = evt.currentTarget.data.d;

    let keyOutput = {
      userId: this.user.id,
      source: 'QuestionBar',
      type: 'HideQuestionBar',
      localTimeStamp: t,
      url: doc.URL,
      detail: evt.detail
    };

    // console.log(keyOutput);
    evt.currentTarget.storeService.postEvent(keyOutput);
  }  

  markfavoritepageListener(evt){
    evt = evt || event;

    let t = Date.now(),
    doc = evt.currentTarget.data.d;

    let keyOutput = {
      userId: this.user.id,
      source: 'QuestionBar',
      type: 'MarkFavoritePage',
      localTimeStamp: t,
      url: doc.URL,
      detail: evt.detail
    };

    // console.log(keyOutput);
    evt.currentTarget.storeService.postEvent(keyOutput);
  }  
  
  unmarkfavoritepageListener(evt){
    evt = evt || event;

    let t = Date.now(),
    doc = evt.currentTarget.data.d;

    let keyOutput = {
      userId: this.user.id,
      source: 'QuestionBar',
      type: 'UnmarkFavoritePage',
      localTimeStamp: t,
      url: doc.URL,
      detail: evt.detail
    };

    // console.log(keyOutput);
    evt.currentTarget.storeService.postEvent(keyOutput);
  }    

}