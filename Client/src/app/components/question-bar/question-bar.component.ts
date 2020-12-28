import { EventEmitter, Inject, Output } from '@angular/core';
import { Component, Input, OnInit } from '@angular/core';
import { GameService } from '../../services/game/game.service';
import { MatDialog, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ChallengeService } from 'src/app/services/game/challenge.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';

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
  value = 100;
  leftValue: string;

  // Answer data
  answerForm: FormGroup;

  constructor(public gameService: GameService,
              public hintDialog: MatDialog,
              public router: Router,
              public challengeService: ChallengeService,
              private formBuilder: FormBuilder,
              private toastr: ToastrService,
              private translate: TranslateService) {
    this.answerForm = this.formBuilder.group({
      answer: ['', Validators.requiredTrue],
      url1: [''],
      url2: ['']
    });
    this.loadChallenge();
    this.startTimer();
  }

  ngOnInit(): void {}

  startTimer() {
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
        this.pauseTimer();
        this.sendDataTimeOut();
      }
    },1000)
  }

  pauseTimer() {
    clearInterval(this.interval);
  }

  tabhideshow(event) {
    const x = document.getElementById("mat-tab");
    if(event.srcElement.classList[0] === "mat-tab-labels" || event.srcElement.classList[0] === "mat-tab-header"){
      x.classList.toggle('hide');
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
    this.timeLeft = this.gameService.challenge.seconds;
    if(this.timeLeft >= 1000) this.leftValue = '20px';
    if(this.timeLeft < 1000) this.leftValue = '30px';
    if(this.timeLeft < 100) this.leftValue = '40px';
    if(this.timeLeft < 10) this.leftValue = '50px';
  }

  sendAnswer() {
    // Add code to submit answer to server
    const challenge = this.gameService.challenge;
    let answer = this.answerForm.value.answer;
    if(answer==null) answer = '';
    // this.challengeService.postAnswer(challenge, answer, this.timeLeft);
    this.challengeService.postAnswer(challenge, answer, this.timeLeft, this.hintUsed).subscribe(
      () => {
        this.toastr.success(this.translate.instant("GAME.TOAST.ANSWER_SUBMITTED"), this.translate.instant("GAME.TOAST.SUCCESS"), {
          timeOut: 5000,
          positionClass: 'toast-top-center'
        });
        clearInterval(this.interval);
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
    // Add code to submit answer to server
    const challenge = this.gameService.challenge;
    let answer = this.answerForm.value.answer;
    if(answer==null) answer = '';
    // this.challengeService.postAnswer(challenge, answer, this.timeLeft);
    this.challengeService.postAnswerFromTimeOut(challenge, this.timeLeft, this.hintUsed).subscribe(
      () => {
        this.toastr.success(this.translate.instant("GAME.TOAST.ANSWER_SUBMITTED"), this.translate.instant("GAME.TOAST.SUCCESS"), {
          timeOut: 5000,
          positionClass: 'toast-top-center'
        });
        clearInterval(this.interval);
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

  showHint(): void {
    const dialogRef = this.hintDialog.open(HintDialogComponent, {
      width: '250px',
      data: {text: this.gameService.challenge.hint}
    });
    this.hintUsed = true;
  }

  getUrl(): void {
    this.answerForm.patchValue({url1: window.location.href});
    console.log(this.answerForm.value);
  }
}

@Component({
  selector: 'app-hint-dialog',
  templateUrl: 'hint-dialog.html',
})
export class HintDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public hint: HintData) {}
}



