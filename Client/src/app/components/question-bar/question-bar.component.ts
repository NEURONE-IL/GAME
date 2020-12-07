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
  challenges: any;
  currentChallenge: number;
  challenge: any;
  hintActive = false;

  // Timer data
  timeLeft: number;
  interval;
  value = 100;
  leftValue: string;

  // Answer data
  answerForm: FormGroup;

  constructor(private gameService: GameService,
              public hintDialog: MatDialog,
              public router: Router,
              private challengeService: ChallengeService,
              private formBuilder: FormBuilder,
              private toastr: ToastrService,
              private translate: TranslateService) {
    this.answerForm = this.formBuilder.group({
      answer: ['', Validators.requiredTrue]
    });
    this.loadChallenge();
    this.startTimer();
  }

  ngOnInit(): void {}

  startTimer() {
    this.interval = setInterval(() => {
      if(this.timeLeft > 0) {
        this.timeLeft--;
        this.value = this.timeLeft * 100 / this.challenges[this.currentChallenge].seconds;
        if (this.timeLeft < 1000) this.leftValue = '30px';
        if (this.timeLeft < 100) this.leftValue = '40px';
        if (this.timeLeft < 10) this.leftValue = '50px';
      }
      if (this.timeLeft==0) {
        console.log('time out!');
        this.pauseTimer();
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
    // Get challenges
    this.challenges = this.gameService.challenges;
    // Get current challenge index
    this.currentChallenge = this.gameService.currentChallenge;
    // Set active challenge
    this.challenges.forEach((challenge, i) => {
      if (i!=this.currentChallenge) {
        challenge.active = false;
      }
    });
    // Set timer data
    this.timeLeft = this.challenges[this.currentChallenge].seconds;
    if(this.timeLeft >= 1000) this.leftValue = '20px';
    if(this.timeLeft < 1000) this.leftValue = '30px';
    if(this.timeLeft < 100) this.leftValue = '40px';
    if(this.timeLeft < 10) this.leftValue = '50px';
  }

  sendAnswer() {
    // Add code to submit answer to server
    const challenge = this.challenges[this.currentChallenge];
    const answer = this.answerForm.value.answer;
    // this.challengeService.postAnswer(challenge, answer, this.timeLeft);
    this.challengeService.postAnswer(challenge, answer, this.timeLeft).subscribe(
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
      data: {text: this.challenges[this.currentChallenge].hint}
    });

    // dialogRef.afterClosed().subscribe();
  }
}

@Component({
  selector: 'app-hint-dialog',
  templateUrl: 'hint-dialog.html',
})
export class HintDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public hint: HintData) {}
}



