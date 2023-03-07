import {EventEmitter, Inject, Output, ViewEncapsulation} from '@angular/core';
import { Component, Input, OnInit } from '@angular/core';
import { GameService } from '../../services/game/game.service';
import { MatDialog, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ChallengeService } from 'src/app/services/game/challenge.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { StudyService } from 'src/app/services/game/study.service';

export interface HintData {
  text: string;
}

@Component({
  selector: 'app-question-bar',
  templateUrl: './question-bar.component.html',
  styleUrls: ['./question-bar.component.css']
})

export class QuestionBarComponent implements OnInit {

  // Challenge data
  hintUsed = false;
  hintActive = false;

  // Timer data
  timeLeft: number;
  interval;
  value = localStorage.getItem('value') || 100;
  leftValue: string;
  assistantUrl: string;

  // Tooltip
  currentTooltip: string;
  sendAnswerTooltip: string;

  // Answer data
  answerForm: FormGroup;

  // Favorite page
  favPage: boolean;

  constructor(public gameService: GameService,
              public hintDialog: MatDialog,
              public router: Router,
              public challengeService: ChallengeService,
              private formBuilder: FormBuilder,
              private toastr: ToastrService,
              private translate: TranslateService,
              private authService: AuthService,
              private studyService: StudyService) {
    this.answerForm = this.formBuilder.group({
      answer: ['', [Validators.required]],
      url1: [''],
      url2: [''],
      rawUrl1: [''],
      rawUrl2: ['']
    });
    this.loadChallenge();
    this.startTimer();
    // On router change, checks if a visited page is marked as favorite
    router.events.subscribe((val) => {
      if(router.url.includes('view-page')){
        this.favPage = this.checkFavPage();
      }
    });
  }

  ngOnInit(): void {
    this.currentTooltip = this.translate.instant("GAME.QUESTION_BAR.TOOLTIP_ADD_SINGLE");
    this.sendAnswerTooltip = this.translate.instant("GAME.QUESTION_BAR.TOOLTIP_SEND");
    this.assistant();
  }

  ngOnDestroy(): void {
    this.setTimeLeft();
    localStorage.setItem('value', this.value.toString())
  }

  clearTimer() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  setTimeLeft(){
    this.gameService.timeLeft = this.timeLeft;
  }

  startTimer() {
    console.log('Seteando timer ahora');
    if(this.gameService.timeLeft !== null){
      this.timeLeft = this.gameService.timeLeft;
    }
    this.interval = setInterval(() => {
      if(this.timeLeft > 0) {
        this.timeLeft--;
        this.value = this.timeLeft * 100 / this.gameService.challenge.seconds;
        if (this.timeLeft < 1000) this.leftValue = '30px';
        if (this.timeLeft < 100) this.leftValue = '40px';
        if (this.timeLeft < 10) this.leftValue = '50px';
      }
      if (this.timeLeft==0) {
        console.log('time out!');
        this.sendDataTimeOut();
      }
    },1000)
  }

  hide= false;
  tabhideshow(event) {
    const x = document.getElementById("mat-tab");
    x.classList.toggle('hide');
    this.hide= !this.hide;
    if(this.hide){
      /*Dispatch hidequestionbar event*/
      var evt = new CustomEvent('hidequestionbar', { detail: 'Hidden with ' + this.timeLeft + ' seconds remaining' });
      window.dispatchEvent(evt);
      /*End dispatch hidequestionbar event*/
    }
    else{
      /*Dispatch showquestionbar event*/
      var evt = new CustomEvent('showquestionbar', { detail: 'Shown with ' + this.timeLeft + ' seconds remaining' });
      window.dispatchEvent(evt);
      /*End dispatch showquestionbar event*/
    }
  }

  onTabChanged(){
    const x = document.getElementById("mat-tab");
    if (x.classList.contains('hide')) {
      x.classList.toggle('hide');
    }
  }

  loadChallenge() {
    // Get challenge
    // this.challenge = this.gameService.challenge;

    // Set timer data
    if(this.router.getCurrentNavigation().extras.state) {
      console.log("time left: ", this.router.getCurrentNavigation().extras.state.timeLeft);
      this.timeLeft = this.router.getCurrentNavigation().extras.state.timeLeft;
    }
    else if(this.gameService.timeLeft){
      this.timeLeft = this.gameService.timeLeft;
    }
    else {
      this.timeLeft = this.gameService.challenge.seconds;
    }
    if(this.timeLeft >= 1000) this.leftValue = '20px';
    if(this.timeLeft < 1000) this.leftValue = '30px';
    if(this.timeLeft < 100) this.leftValue = '40px';
    if(this.timeLeft < 10) this.leftValue = '50px';
  }

  sendAnswer() {
    let isValid = this.checkValid();
    if(!isValid) return;
    // Add code to submit answer to server
    const challenge = this.gameService.challenge;
    let answer = this.answerForm.value.answer.toString();
    if(this.gameService.challenge.answer_type === 'url'){
      answer = this.answerForm.value.rawUrl1;
    }
    if(answer==null) answer = '';
    let url1 = this.answerForm.value.rawUrl1;
    let url2 = this.answerForm.value.rawUrl2;
    // this.challengeService.postAnswer(challenge, answer, this.timeLeft);
    this.challengeService.postAnswer(challenge, answer, url1, url2, this.timeLeft, this.hintUsed, null).subscribe(
      () => {
        this.toastr.success(this.translate.instant("GAME.TOAST.ANSWER_SUBMITTED"), this.translate.instant("GAME.TOAST.SAVED"), {
          timeOut: 5000,
          positionClass: 'toast-top-center'
        });
        this.clearTimer();
        this.gameService.finishChallenge();
      },
      err => {
        this.toastr.error(this.translate.instant("GAME.TOAST.ERROR_MESSAGE"), this.translate.instant("GAME.TOAST.ERROR"), {
          timeOut: 5000,
          positionClass: 'toast-top-center'
        });
      }
    );
  }

  // Send data when the player runs out of time (no answer).
  sendDataTimeOut() {
    this.clearTimer();
    // Add code to submit answer to server
    const challenge = this.gameService.challenge;
    let answer = this.answerForm.value.answer;
    let url1 = this.answerForm.value.rawUrl1;
    let url2 = this.answerForm.value.rawUrl2;    
    if(answer==null) answer = '';
    // this.challengeService.postAnswer(challenge, answer, this.timeLeft);
    this.challengeService.postAnswer(challenge, answer, url1, url2, this.timeLeft, this.hintUsed, "TIMED_OUT").subscribe(
      () => {
        this.toastr.success(this.translate.instant("GAME.TOAST.TIMED_OUT_ANSWER"), this.translate.instant("GAME.TOAST.SAVED"), {
          timeOut: 5000,
          positionClass: 'toast-top-center'
        });
        this.gameService.finishChallenge();
      },
      err => {
        this.toastr.error(this.translate.instant("GAME.TOAST.TIMED_OUT_ANSWER_ERROR"), this.translate.instant("GAME.TOAST.ERROR"), {
          timeOut: 5000,
          positionClass: 'toast-top-center'
        });
        this.gameService.finishChallenge();
      }
    );
  }

  checkValid(){
    if(!this.answerForm.value.answer && (this.gameService.challenge.answer_type === "string" || this.gameService.challenge.answer_type === "number")){
      this.toastr.warning(this.translate.instant("GAME.TOAST.EMPTY_ANSWER"), this.translate.instant("GAME.TOAST.WARNING"), {
        timeOut: 5000,
        positionClass: 'toast-top-center'
      });
      return false;
    }
    if(!this.answerForm.value.answer && this.gameService.challenge.answer_type === "url"){
      this.toastr.warning(this.translate.instant("GAME.TOAST.EMPTY_URL"), this.translate.instant("GAME.TOAST.WARNING"), {
        timeOut: 5000,
        positionClass: 'toast-top-center'
      });
      return false;
    }
    if(!this.answerForm.value.url1 && this.gameService.challenge.answer_type === "justify"){
      this.toastr.warning(this.translate.instant("GAME.TOAST.EMPTY_URL"), this.translate.instant("GAME.TOAST.WARNING"), {
        timeOut: 5000,
        positionClass: 'toast-top-center'
      });
      return false;
    }    
    if(!this.answerForm.value.answer && this.gameService.challenge.answer_type === "justify"){
      this.toastr.warning(this.translate.instant("GAME.TOAST.EMPTY_JUSTIFY"), this.translate.instant("GAME.TOAST.WARNING"), {
        timeOut: 5000,
        positionClass: 'toast-top-center'
      });
      return false;
    }
    return true;
  }    

  showHint(): void {
    const dialogRef = this.hintDialog.open(HintDialogComponent, {
      width: '250px',
      data: {text: this.gameService.challenge.hint}
    });
    this.hintUsed = true;
  }

  favoriteActionSingle(): void{
    //URL example: http://localhost:4200/session/view-page/2004%20Bahrain%20Grand%20Prix/assets%2FdownloadedDocs%2FBahrain%2Fen.wikipedia.org%2Fwiki%2F2004_Bahrain_Grand_Prix%2Findex.html
    const titleArray = window.location.href.split('/');
    //Get docTitle
    let docTitle = decodeURIComponent(titleArray[5]);
    //Get docURL
    let rawUrl = decodeURIComponent(titleArray[6]);
    //Remove the URL prefix from NEURONE Core
    const urlArray = rawUrl.split('/');
    let docURL = '';
    for(var i=3; i<urlArray.length; i++){
      docURL += urlArray[i] + '/';
    }
    //Remove the URL postfix from NEURONE Core
    docURL = docURL.split(';')[0];
    var finalURL = docURL.replace('/index.html', '');
    var checkPage = this.checkPageSingle(finalURL);
    if(checkPage === 1 || checkPage === 3){
      /*Dispatch unmarkfavoritepage event*/
      var evt = new CustomEvent('unmarkfavoritepage', { detail: 'Unmark "' + this.answerForm.value.url1 + '" as favorite page' });
      window.dispatchEvent(evt);
      /*End dispatch unmarkfavoritepage event*/
      this.answerForm.patchValue({url1: ''});
      this.answerForm.patchValue({rawUrl1: ''});
      this.currentTooltip = this.translate.instant("GAME.QUESTION_BAR.TOOLTIP_ADD_SINGLE");
      this.favPage = false;
//      console.log('En URL 1');
    }
    else if(checkPage === 4){
      // The page isn't marked as favorite and the url1 field isn't empty
      /*Dispatch markfavoritepage event*/
      var evt = new CustomEvent('markfavoritepage', { detail: 'Mark "' + finalURL + '" as favorite page' });
      window.dispatchEvent(evt);
      /*End dispatch markfavoritepage event*/
      this.answerForm.patchValue({url1: finalURL});
      this.answerForm.patchValue({rawUrl1: finalURL});
      this.currentTooltip = this.translate.instant("GAME.QUESTION_BAR.TOOLTIP_REMOVE_SINGLE");
      this.favPage = true;
//      console.log('Asignado a URL 1');
    }
  }


  favoriteAction(): void{
    //URL example: http://localhost:4200/session/view-page/2004%20Bahrain%20Grand%20Prix/assets%2FdownloadedDocs%2FBahrain%2Fen.wikipedia.org%2Fwiki%2F2004_Bahrain_Grand_Prix%2Findex.html
    const titleArray = window.location.href.split('/');
    //Get docTitle
    let docTitle = decodeURIComponent(titleArray[5]);
    //Get docURL
    let rawUrl = decodeURIComponent(titleArray[6]);
    //Remove the URL prefix from NEURONE Core
    const urlArray = rawUrl.split('/');
    let docURL = '';
    for(var i=3; i<urlArray.length; i++){
      docURL += urlArray[i] + '/';
    }
    //Remove the URL postfix from NEURONE Core
    var finalURL = docURL.replace('/index.html', '');
    var checkPage = this.checkPageSingle(finalURL);
    // The page is already marked as favorite in the url1 field
    if(checkPage === 1){
      this.answerForm.patchValue({url1: ''});
      this.answerForm.patchValue({rawUrl1: ''});
      this.currentTooltip = this.translate.instant("GAME.QUESTION_BAR.TOOLTIP_ADD_SINGLE");
      this.favPage = false;
//      console.log('En URL 1');
    }
    // The page is already marked as favorite in the url2 field
    else if(checkPage === 2){
      this.answerForm.patchValue({url2: ''});
      this.answerForm.patchValue({rawUrl2: ''});
      this.currentTooltip = this.translate.instant("GAME.QUESTION_BAR.TOOLTIP_ADD_SINGLE");
      this.favPage = false;
//      console.log('En URL 2');
    }
    else{
    // The page isn't marked as favorite and the url1 field is empty
      if(this.answerForm.get('url1').value === ''){
        this.answerForm.patchValue({url1: finalURL});
        this.answerForm.patchValue({rawUrl1: finalURL});
        this.currentTooltip = this.translate.instant("GAME.QUESTION_BAR.TOOLTIP_REMOVE_SINGLE");
        this.favPage = true;
//        console.log('Asignado a URL 1');
      }
    // The page isn't marked as favorite and the url2 field is empty
      else if(this.answerForm.get('url2').value === ''){
        this.answerForm.patchValue({url2: finalURL});
        this.answerForm.patchValue({rawUrl2: finalURL});
        this.currentTooltip = this.translate.instant("GAME.QUESTION_BAR.TOOLTIP_REMOVE_SINGLE");
        this.favPage = true;
//        console.log('Asignado a URL 2');
      }
      else{
    // The page isn't marked as favorite and the url1 and url2 fields aren't empty
        this.favPage = false;
//        console.log('Ambos ocupados');
        this.toastr.info(this.translate.instant("GAME.QUESTION_BAR.TOAST.INFO_MESSAGE"), this.translate.instant("GAME.QUESTION_BAR.TOAST.INFO"), {
          timeOut: 8000,
          positionClass: 'toast-top-center'
        });
      }
    }
  }

  favoriteActionURL(): void{
    //URL example: http://localhost:4200/session/view-page/2004%20Bahrain%20Grand%20Prix/assets%2FdownloadedDocs%2FBahrain%2Fen.wikipedia.org%2Fwiki%2F2004_Bahrain_Grand_Prix%2Findex.html
    const titleArray = window.location.href.split('/');
    //Get docTitle
    let docTitle = decodeURIComponent(titleArray[5]);
    //Get docURL
    let rawUrl = decodeURIComponent(titleArray[6]);
    //Remove the URL prefix from NEURONE Core
    const urlArray = rawUrl.split('/');
    let docURL = '';
    for(var i=3; i<urlArray.length; i++){
      docURL += urlArray[i] + '/';
    }
    //Remove the URL postfix from NEURONE Core
    docURL = docURL.split(';')[0];
    var finalURL = docURL.replace('/index.html', '');
    var checkPage = this.checkPageURL(finalURL);
    if(checkPage === 1 || checkPage === 3){
      /*Dispatch unmarkfavoritepage event*/
      var evt = new CustomEvent('unmarkfavoritepage', { detail: 'Unmark "' + this.answerForm.value.answer + '" as favorite page' });
      window.dispatchEvent(evt);
      /*End dispatch unmarkfavoritepage event*/
      this.answerForm.patchValue({answer: ''});
      this.currentTooltip = this.translate.instant("GAME.QUESTION_BAR.TOOLTIP_ADD_SINGLE");
      this.favPage = false;
//      console.log('En URL 1');
    }
    else if(checkPage === 4){
      // The page isn't marked as favorite and the url1 field isn't empty
      /*Dispatch markfavoritepage event*/
      var evt = new CustomEvent('markfavoritepage', { detail: 'Mark "' + finalURL + '" as favorite page' });
      window.dispatchEvent(evt);
      /*End dispatch markfavoritepage event*/
      this.answerForm.patchValue({answer: finalURL});
      this.currentTooltip = this.translate.instant("GAME.QUESTION_BAR.TOOLTIP_REMOVE_SINGLE");
      this.favPage = true;
//      console.log('Asignado a URL 1');
    }
  }
  
  checkFavPage(){
    //URL example: http://localhost:4200/session/view-page/2004%20Bahrain%20Grand%20Prix/assets%2FdownloadedDocs%2FBahrain%2Fen.wikipedia.org%2Fwiki%2F2004_Bahrain_Grand_Prix%2Findex.html
    const titleArray = window.location.href.split('/');
    //Get docTitle
    let docTitle = decodeURI(titleArray[5]);
    //Get docURL
    let rawUrl = decodeURIComponent(titleArray[6]);
    //Remove the URL prefix from NEURONE Core
    const urlArray = rawUrl.split('/');
    let docURL = '';
    for(var i=3; i<urlArray.length; i++){
      docURL += urlArray[i] + '/';
    }
    //Remove the URL postfix from NEURONE Core
    var checkPage = this.checkPage(docURL);
    if(checkPage === 1 || checkPage === 2){
      this.currentTooltip = this.translate.instant("GAME.QUESTION_BAR.TOOLTIP_REMOVE_SINGLE");
      return true;
    }
    this.currentTooltip = this.translate.instant("GAME.QUESTION_BAR.TOOLTIP_ADD_SINGLE");
    return false;
  }


  checkPage(docURL: string){
    if(this.answerForm.controls['url1'].value){
      return 1;
    }
    return 3;
//    if(this.answerForm.controls['url1'].value === docURL && docURL != ''){
//      console.log('Match 1');
//      return 1;
//    }
//    else if(this.answerForm.controls['url2'].value === docURL && docURL != ''){
//      console.log('Match 2');
//      return 2;
//    }
//    console.log('No match');
//    return 3;
  }

  checkPageSingle(docURL: string){
    if(this.answerForm.controls['url1'].value === docURL && docURL != ''){
//      console.log('Match 1');
      return 1;
    }
    else if(this.answerForm.controls['url1'].value != docURL && this.answerForm.controls['url1'].value != ''){
//      console.log('Match 3');
      return 3;
    }
    else{
//      console.log('Match 4');
      return 4;
    }
  }

  checkPageURL(docURL: string){
    if(this.answerForm.controls['answer'].value === docURL && docURL != ''){
//      console.log('Match 1');
      return 1;
    }
    else if(this.answerForm.controls['answer'].value != docURL && this.answerForm.controls['answer'].value != ''){
//      console.log('Match 3');
      return 3;
    }
    else{
//      console.log('Match 4');
      return 4;
    }
  }

  assistant(){
    let study = this.authService.getUser().study;
    this.studyService.getAssistant(study).subscribe( response => {
      let assistant = response['studyAssistant'].assistant;
      if(assistant){
        this.assistantUrl = `http://va.neurone.info/assistant/${assistant}/${this.authService.getUser()._id}/Trivia/${study}/challenge`;
      }
    })
    
  }

  get answerControls(): any {
    return this.answerForm['controls'];
  }  

}

@Component({
  selector: 'app-hint-dialog',
  templateUrl: 'hint-dialog.html',
})
export class HintDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public hint: HintData) {}
}



