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
      this.bindEvent(targetDoc, 'pageenter', data, this.pageenterListener);
      this.bindEvent(targetDoc, 'pageexit', data, this.pageexitListener);
      this.bindEvent(targetDoc, 'pretestquestionnaireenter', data, this.pretestquestionnaireenterListener);
      this.bindEvent(targetDoc, 'pretestquestionnaireexit', data, this.pretestquestionnaireexitListener);
      this.bindEvent(targetDoc, 'posttestquestionnaireenter', data, this.posttestquestionnaireenterListener);
      this.bindEvent(targetDoc, 'posttestquestionnaireexit', data, this.posttestquestionnaireexitListener);  
      this.bindEvent(targetDoc, 'poststudyquestionnaireenter', data, this.poststudyquestionnaireenterListener);
      this.bindEvent(targetDoc, 'poststudyquestionnaireexit', data, this.poststudyquestionnaireexitListener);
      this.bindEvent(targetDoc, 'sendanswer', data, this.sendanswerListener);
      this.bindEvent(targetDoc, 'startchallenge', data, this.startchallengeListener);
      this.bindEvent(targetDoc, 'finishchallenge', data, this.finishchallengeListener);
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
      this.unbindAll(targetDoc, 'pageenter');
      this.unbindAll(targetDoc, 'pageexit'); 
      this.unbindAll(targetDoc, 'pretestquestionnaireenter');
      this.unbindAll(targetDoc, 'pretestquestionnaireexit');         
      this.unbindAll(targetDoc, 'posttestquestionnaireenter');         
      this.unbindAll(targetDoc, 'posttestquestionnaireexit');         
      this.unbindAll(targetDoc, 'poststudyquestionnaireenter');         
      this.unbindAll(targetDoc, 'poststudyquestionnaireexit');
      this.unbindAll(targetDoc, 'sendanswer');
      this.unbindAll(targetDoc, 'startchallenge');
      this.unbindAll(targetDoc, 'finishchallenge');
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
      studyId: this.user.study,
      challengeId: localStorage.getItem('chall'),      
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
      studyId: this.user.study,
      challengeId: localStorage.getItem('chall'),      
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
      studyId: this.user.study,
      challengeId: localStorage.getItem('chall'),      
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
      studyId: this.user.study,
      challengeId: localStorage.getItem('chall'),      
      source: 'QuestionBar',
      type: 'UnmarkFavoritePage',
      localTimeStamp: t,
      url: doc.URL,
      detail: evt.detail
    };

    // console.log(keyOutput);
    evt.currentTarget.storeService.postEvent(keyOutput);
  } 
  
  pageenterListener(evt){
    evt = evt || event;

    let t = Date.now(),
    doc = evt.currentTarget.data.d;

    let keyOutput = {
      userId: this.user.id,
      studyId: this.user.study,
      challengeId: localStorage.getItem('chall'),      
      source: 'Window',
      type: 'PageEnter',
      localTimeStamp: t,
      url: doc.URL,
      detail: evt.detail.detail,
      docId: evt.detail.docId
    };

    // console.log(keyOutput);
    evt.currentTarget.storeService.postEvent(keyOutput);
  }  

  pageexitListener(evt){
    evt = evt || event;

    let t = Date.now(),
    doc = evt.currentTarget.data.d;

    let keyOutput = {
      userId: this.user.id,
      studyId: this.user.study,
      challengeId: localStorage.getItem('chall'),      
      source: 'Window',
      type: 'PageExit',
      localTimeStamp: t,
      url: doc.URL,
      detail: evt.detail.detail,
      docId: evt.detail.docId
    };

    // console.log(keyOutput);
    evt.currentTarget.storeService.postEvent(keyOutput);
  }   

  pretestquestionnaireenterListener(evt){
    evt = evt || event;

    let t = Date.now(),
    doc = evt.currentTarget.data.d;

    let keyOutput = {
      userId: this.user.id,
      studyId: this.user.study,
      challengeId: localStorage.getItem('chall'),      
      source: 'Window',
      type: 'PreTestQuestionnaireEnter',
      localTimeStamp: t,
      url: doc.URL
    };

    // console.log(keyOutput);
    evt.currentTarget.storeService.postEvent(keyOutput);
  }

  pretestquestionnaireexitListener(evt){
    evt = evt || event;

    let t = Date.now(),
    doc = evt.currentTarget.data.d;

    let keyOutput = {
      userId: this.user.id,
      studyId: this.user.study,
      challengeId: localStorage.getItem('chall'),      
      source: 'Window',
      type: 'PreTestQuestionnaireExit',
      localTimeStamp: t,
      url: doc.URL
    };

    // console.log(keyOutput);
    evt.currentTarget.storeService.postEvent(keyOutput);
  }
  
  posttestquestionnaireenterListener(evt){
    evt = evt || event;

    let t = Date.now(),
    doc = evt.currentTarget.data.d;

    let keyOutput = {
      userId: this.user.id,
      studyId: this.user.study,
      challengeId: localStorage.getItem('chall'),      
      source: 'Window',
      type: 'PostTestQuestionnaireEnter',
      localTimeStamp: t,
      url: doc.URL
    };

    // console.log(keyOutput);
    evt.currentTarget.storeService.postEvent(keyOutput);
  }
  
  posttestquestionnaireexitListener(evt){
    evt = evt || event;

    let t = Date.now(),
    doc = evt.currentTarget.data.d;

    let keyOutput = {
      userId: this.user.id,
      studyId: this.user.study,
      challengeId: localStorage.getItem('chall'),      
      source: 'Window',
      type: 'PostTestQuestionnaireExit',
      localTimeStamp: t,
      url: doc.URL
    };

    // console.log(keyOutput);
    evt.currentTarget.storeService.postEvent(keyOutput);
  }  

  poststudyquestionnaireenterListener(evt){
    evt = evt || event;

    let t = Date.now(),
    doc = evt.currentTarget.data.d;

    let keyOutput = {
      userId: this.user.id,
      studyId: this.user.study,
      source: 'Window',
      type: 'PostStudyQuestionnaireEnter',
      localTimeStamp: t,
      url: doc.URL
    };

    // console.log(keyOutput);
    evt.currentTarget.storeService.postEvent(keyOutput);
  }
  
  poststudyquestionnaireexitListener(evt){
    evt = evt || event;

    let t = Date.now(),
    doc = evt.currentTarget.data.d;

    let keyOutput = {
      userId: this.user.id,
      studyId: this.user.study,  
      source: 'Window',
      type: 'PostStudyQuestionnaireExit',
      localTimeStamp: t,
      url: doc.URL
    };

    // console.log(keyOutput);
    evt.currentTarget.storeService.postEvent(keyOutput);
  }  

  sendanswerListener(evt){
    evt = evt || event;

    let t = Date.now(),
    doc = evt.currentTarget.data.d;

    let keyOutput = {
      userId: this.user.id,
      studyId: this.user.study,
      challengeId: localStorage.getItem('chall'),
      source: 'QuestionBar',
      type: 'SendAnswer',
      localTimeStamp: t,
      url: doc.URL,
    };

    // console.log(keyOutput);
    evt.currentTarget.storeService.postEvent(keyOutput);
  }  

  startchallengeListener(evt){
    evt = evt || event;

    let t = Date.now(),
    doc = evt.currentTarget.data.d;

    let keyOutput = {
      userId: this.user.id,
      studyId: this.user.study,
      challengeId: localStorage.getItem('chall'),
      source: 'QuestionBar',
      type: 'StartChallenge',
      localTimeStamp: t,
      url: doc.URL,
    };

    // console.log(keyOutput);
    evt.currentTarget.storeService.postEvent(keyOutput);
  } 
  
  finishchallengeListener(evt){
    evt = evt || event;

    let t = Date.now(),
    doc = evt.currentTarget.data.d;

    let keyOutput = {
      userId: this.user.id,
      studyId: this.user.study,
      challengeId: localStorage.getItem('chall'),
      source: 'QuestionBar',
      type: 'FinishChallenge',
      localTimeStamp: t,
      url: doc.URL,
    };

    // console.log(keyOutput);
    evt.currentTarget.storeService.postEvent(keyOutput);
  }   

}