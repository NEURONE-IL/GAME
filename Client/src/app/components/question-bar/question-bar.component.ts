import { EventEmitter, Inject, Output } from '@angular/core';
import { Component, Input, OnInit } from '@angular/core';
import { GameService } from '../../services/game/game.service';
import { MatDialog, MAT_DIALOG_DATA} from '@angular/material/dialog';

export interface HintData {
  text: string;
}

@Component({
  selector: 'app-question-bar',
  templateUrl: './question-bar.component.html',
  styleUrls: ['./question-bar.component.css']
})

export class QuestionBarComponent implements OnInit {

  challenges: any;
  currentChallenge: number;

  timeLeft: number;
  interval;
  value = 100;
  leftValue = '30px';
  hintActive = false;
  // tabs = ['looks_one', 'looks_two']//,'looks_two','looks_3','looks_4', 'looks_5', 'looks_6']
  constructor(private gameService: GameService, public hintDialog: MatDialog) {
    this.refreshChallenge();
  }

  ngOnInit(): void {
    this.interval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
        this.value = this.timeLeft / 120 * 100;
        if (this.timeLeft < 100){
          this.leftValue = '40px';
          this.hintActive = true;
        }
      } else {
        this.timeLeft = 120;
        this.leftValue = '30px';
      }
    }, 1000);
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

  refreshChallenge() {
    this.challenges = this.gameService.challenges;
    this.currentChallenge = this.gameService.currentChallenge;
    this.timeLeft = this.challenges[this.currentChallenge].seconds;
    this.challenges.forEach((challenge, i) => {
      if (i!=this.currentChallenge) {
        challenge.active = false;
      }
    });
    console.log(this.currentChallenge);
  }

  finishChallenge() {
    this.gameService.nextChallenge();
    this.refreshChallenge();
  }

  showHint(): void {
    const dialogRef = this.hintDialog.open(HintDialog, {
      width: '250px',
      data: {text: this.challenges[this.currentChallenge].hint}
    });

    // dialogRef.afterClosed().subscribe();
  }
}

@Component({
  selector: 'hint-dialog-content',
  templateUrl: 'hint-dialog.html',
})
export class HintDialog {
  constructor(@Inject(MAT_DIALOG_DATA) public hint: HintData) {}
}



