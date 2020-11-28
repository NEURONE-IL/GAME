import { EventEmitter, Output } from '@angular/core';
import { Component, Input, OnInit } from '@angular/core';
import { GameService } from '../../services/game/game.service';

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
  tabs = ['looks_one']//,'looks_two','looks_3','looks_4', 'looks_5', 'looks_6']
  constructor(private gameService: GameService) {
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
  }

  finishChallenge() {
    this.gameService.nextChallenge();
    this.refreshChallenge();
  }
}



