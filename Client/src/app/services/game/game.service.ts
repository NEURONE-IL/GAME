import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { ChallengeService } from './challenge.service';
import { StudyService } from './study.service';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  // player: any;
  study: any;
  challenges: any;
  currentChallenge: number;
  challenge: any;
  stage: string;
  loading = true;
  gameActive: boolean;

  gameDataChange: Subject<boolean> = new Subject<boolean>();

  constructor(private challengeService: ChallengeService,
              private studyService: StudyService,
              public router: Router,
              private authService: AuthService) {
    this.init();
  }

  init() {
    if (this.authService.loggedIn) {
      console.log('gameService init');
      this.loadGameData();
    }
  }

  async loadGameData() {
    await new Promise(r => setTimeout(r, 1000)); // For testing purposes only
    JSON.parse(localStorage.getItem('currentUser'));
    // this.player = this.authService.getUser();
    this.study = await this.studyService.getStudy(this.authService.getUser().study).toPromise();
    this.study = this.study.study;
    this.gameActive = true;
    // For one challenge at once
    const challengeId = this.getCurrentChallenge();
    if (challengeId!=null) {
      this.challenge = await this.challengeService.getChallenge(challengeId).toPromise();
      this.challenge = this.challenge.challenge;
    }
    else {
      this.gameActive = false;
    }
    this.fetchUserStage();
    this.loading = false;
    console.log('done loading game data');
    console.log(this.challenge);
    this.gameDataChange.next();
  }

  storeToLocal() {
    localStorage.setItem('game', JSON.stringify({
      // 'player': this.player,
      'study': this.study,
      'challenge': this.challenge,
      'stage': this.stage,
      'gameActive': this.gameActive
    }));
  }

  fetchFromLocal() {
    const localData = JSON.parse(localStorage.getItem('game'));
    // this.player = this.authService.getUser();
    this.study = localData.study;
    this.gameActive = localData.gameActive;
    this.challenge = localData.challenge;
    this.fetchUserStage();
    this.loading = false;
  }

  finishChallenge() {
    this.setStage('post-test');
    this.storeToLocal();
    this.router.navigate(['start']);
  }

  nextChallenge() {
    if(this.currentChallenge+1<this.challenges.length) {
      this.currentChallenge = this.currentChallenge + 1;
    }
    else {
      this.gameActive = false;
      console.log('no more challenges');
    }
    this.router.navigate(['start']);
    this.setStage('pre-test');
    this.storeToLocal();
  }

  fetchUserStage() {
    console.log('fetching user stage');
    if(this.stage!='pre-test' && this.stage!='gameplay' && this.stage!='post-test') {
      if (!this.authService.getUser().assent) {
        console.log('user stage is assent')
        this.stage = 'assent';
      }
      else if (!this.authService.getUser().initial_questionnaire) {
        console.log('user stage is initial')
        this.stage = 'initial';
      }
      else {
        console.log('user stage is pre-test');
        this.stage = 'pre-test';
      }
    }
  }

  setStage(stage) {
    this.stage = stage;
    this.gameDataChange.next();
  }

  getStage() {
    const user = this.authService.getUser();
    const stage = '';
    return user.challenges_progress;
  }

  getCurrentChallenge() {
    const user = this.authService.getUser();
    const challenge = user.challenges_progress.find(challenge => challenge.finished == false);
    if (challenge!=null) return challenge.challenge;
    else return null;
  }
}
