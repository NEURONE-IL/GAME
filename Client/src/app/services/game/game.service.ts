import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { ChallengeService } from './challenge.service';
import { StudyService } from './study.service';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  player: any;
  study: any;
  challenges: any;
  currentChallenge: number;
  challenge: any;
  stage: string;
  loading: boolean;
  gameActive: boolean;

  gameDataChange: Subject<boolean> = new Subject<boolean>();

  constructor(private authService: AuthService,
              private challengeService: ChallengeService,
              private studyService: StudyService) {

    this.init();
  }

  init() {
    console.log('gameService init');
    this.loadGameData();
  }

  async loadGameData() {
    await new Promise(r => setTimeout(r, 1000)); // For testing purposes only
    this.player = this.authService.getUser();
    this.study = await this.studyService.getStudy(this.player.study).toPromise();
    this.study = this.study.study;
    this.gameActive = true;
    // For multiple challenges support
    this.challenges = await this.challengeService.getChallengesByStudy(this.player.study).toPromise();
    this.challenges = this.challenges.challenges;
    // For one challenge at once
    this.currentChallenge = 0; // Will be loaded from database later
    this.challenge = this.challenges[this.currentChallenge];
    this.stage = 'assent';
    this.loading = false;
    console.log('done loading game data');
    this.gameDataChange.next();
  }

  nextChallenge() {
    if(this.currentChallenge+1<this.challenges.length) {
      this.currentChallenge = this.currentChallenge + 1;
      this.setStage('pre-test');
    }
    else {
      console.log('no more challenges');
    }
  }

  setStage(stage) {
    this.stage = stage;
    this.gameDataChange.next();
  }

  printGameData() {
    console.log(this.player);
    console.log(this.study);
    console.log(this.challenges);
    console.log(this.currentChallenge);
  }

}
