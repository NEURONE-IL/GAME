import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { ChallengeService } from './challenge.service';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  challenge: any;
  stage: string;
  loading: boolean;
  gameActive: boolean;
  progress: any;

  constructor(private challengeService: ChallengeService,
              public router: Router,
              private authService: AuthService) {
  }

  async load() {
    if (this.authService.loggedIn) {
      await this.loadGameData();
    }
  }

  async loadGameData() {
    // this.player = this.authService.getUser();
    await this.authService.refreshUser();
    this.progress = await this.authService.refreshProgress();
    this.gameActive = true;
    this.loading = true;
    // For one challenge at once
    const challengeId = this.getCurrentChallengeId();
    if (challengeId!=null) {
      this.challenge = await this.challengeService.getChallenge(challengeId).toPromise();
      this.challenge = this.challenge.challenge;
      this.fetchUserStage();
    }
    else {
      this.gameActive = false;
    }
    await new Promise(r => setTimeout(r, 1000)); // For testing purposes only
    this.loading = false;

  }

  finishChallenge() {
    this.stage = 'post-test';
    this.router.navigate(['start']);
  }

  nextChallenge() {
    this.router.navigate(['start']);
    this.stage ='pre-test';
  }

  fetchUserStage() {
    const user = this.authService.getUser();
    if (!this.progress.assent) {
      this.stage = 'assent';
    }
    else if (!this.progress.initial_questionnaire) {
      this.stage = 'initial';
    }
    else {
      this.progress.challenges.forEach(chProgress => {
        if(chProgress.challenge==this.challenge._id) {
          if (!chProgress.pre_test) {
            this.stage = 'pre-test';
          }
          else if (chProgress.started) {
            this.stage = 'post-test';
          }
          else {
            this.stage = 'instructions';
          }
        }
      });
    }
    console.log('stage: ', this.stage);
  }

  setStage(stage) {
    this.stage = stage;
    this.router.navigate(['start', stage]);
  }

  async finishPreTest() {
    let progress = this.progress;
    progress.challenges.forEach(chProgress => {
      if(this.challenge._id==chProgress.challenge) {
        chProgress.pre_test = true;
      }
    });
    await this.authService.updateProgress({challenges: progress.challenges});
  }

  async challengeStarted() {
    let progress = this.progress;
    progress.challenges.forEach(chProgress => {
      if(this.challenge._id==chProgress.challenge) {
        chProgress.started = true;
      }
    });
    await this.authService.updateProgress({challenges: progress.challenges});
  }

  async finishPostTest() {
    let progress = this.progress;
    progress.challenges.forEach(chProgress => {
      if(this.challenge._id==chProgress.challenge) {
        chProgress.post_test = true;
        chProgress.finished = true;
      }
    });
    await this.authService.updateProgress({challenges: progress.challenges});
    this.load();
    this.router.navigate(['/']);
  }

  getCurrentChallengeId() {
    const challenge = this.progress.challenges.find(ch => ch.finished == false);
    console.log(this.progress);
    console.log(challenge);
    if (challenge!=null) return challenge.challenge;
    else return null;
  }
}
