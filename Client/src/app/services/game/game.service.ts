import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { ChallengeService } from './challenge.service';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  currentChallenge: any;
  challenge: any;
  stage: string;
  loading = true;
  gameActive: boolean;

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
    await new Promise(r => setTimeout(r, 1000)); // For testing purposes only
    // this.player = this.authService.getUser();
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
  }

  finishChallenge() {
    this.stage = 'post-test';
    this.router.navigate(['start']);
  }

  nextChallenge() {
    // if(this.currentChallenge+1<this.challenges.length) {
    //   this.currentChallenge = this.currentChallenge + 1;
    // }
    // else {
    //   this.gameActive = false;
    // }
    this.router.navigate(['start']);
    this.stage ='pre-test';
  }

  fetchUserStage() {
    const user = this.authService.getUser();
    if (!user.assent) {
      this.stage = 'assent';
    }
    else if (!user.initial_questionnaire) {
      this.stage = 'initial';
    }
    else {
      user.challenges_progress.forEach(chProgress => {
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

  updateUserProgress(currentStage) {
    let progress = this.authService.getUser().challenges_progress;
    progress.forEach(chProgress => {
      if(this.challenge._id==chProgress.challenge) {
        if(currentStage=='pre-test') {
          chProgress.pre_test = true;
        }
        else if(currentStage=='post-test') {
          chProgress.post_test = true;
          chProgress.finished = true;
        }
        else if(currentStage=='gameplay') {
          chProgress.started = true;
        }
      }
    });
    this.authService.updateUser({"challenges_progress": progress});
  }

  getCurrentChallenge() {
    const user = this.authService.getUser();
    const challenge = user.challenges_progress.find(ch => ch.finished == false);
    if (challenge!=null) return challenge.challenge;
    else return null;
  }


}
