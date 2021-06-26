import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { ChallengeService } from './challenge.service';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  challenge: any;
  stage: string;
  loading: boolean;
  progress: any;
  canPlay: any;
  timeLeft: number = null;

  constructor(
    private challengeService: ChallengeService,
    public router: Router,
    private authService: AuthService
  ) {}

  async load() {
    if (this.authService.loggedIn) {
      await this.loadGameData();
    }
  }

  async loadGameData() {
    this.loading = true;
    await this.authService.refreshUser();
    this.progress = await this.authService.refreshProgress();
    // For one challenge at once
    const challengeId = this.getCurrentChallengeId();
    if (challengeId != null) {
      this.challenge = await this.challengeService
        .getChallenge(challengeId)
        .toPromise();
      this.challenge = this.challenge.challenge;
      this.fetchUserStage();
      if (this.stage != 'summary' && this.stage != 'post-test') {
        this.canPlay = await this.authService.canPlay();
      } else {
        this.canPlay = { canPlay: true };
      }
    } else {
      this.canPlay = { canPlay: false };
    }
    this.loading = false;
  }

  finishChallenge() {
    let progress = this.progress;
    progress.challenges.forEach((chProgress) => {
      if (this.challenge._id == chProgress.challenge) {
        chProgress.answer_submitted = true;
      }
    });
    this.authService
      .updateProgress({ challenges: progress.challenges })
      .then(() => {
        this.timeLeft = null;
        this.stage = 'summary';
        this.router.navigate(['start']);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  nextChallenge() {
    this.router.navigate(['start']);
    this.stage = 'pre-test';
  }

  fetchUserStage() {
    const user = this.authService.getUser();
    if (!this.progress.assent) {
      this.stage = 'assent';
    } else {
      this.progress.challenges.forEach((chProgress) => {
        if (chProgress.challenge == this.challenge._id) {
          if (!chProgress.pre_test) {
            this.stage = 'pre-test';
          } else if (chProgress.started) {
            if (chProgress.start_time != null && !chProgress.answer_submitted) {
              let endTime = new Date(chProgress.start_time);
              endTime.setSeconds(endTime.getSeconds() + this.challenge.seconds);
              const canContinue = new Date(Date.now()) < endTime ? true : false;
              if (canContinue) {
                this.stage = 'gameplay';
                this.challengeStarted();
              } else {
                this.stage = 'post-test';
              }
            } else {
              this.stage = 'post-test';
            }
          } else {
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
    progress.challenges.forEach((chProgress) => {
      if (this.challenge._id == chProgress.challenge) {
        chProgress.pre_test = true;
      }
    });
    this.authService
      .updateProgress({ challenges: progress.challenges })
      .then(() => {
        this.stage = 'instructions';
      });
  }

  async challengeStarted() {
    let progress = this.progress;
    let overwriteSeconds = false;
    progress.challenges.forEach((chProgress) => {
      if (this.challenge._id == chProgress.challenge) {
        if (!chProgress.started) {
          chProgress.started = true;
          chProgress.start_time = Date.now();
        } else {
          overwriteSeconds = true;
        }
      }
    });
    this.authService
      .updateProgress({ challenges: progress.challenges })
      .then(() => {
        this.stage = 'gameplay';
        if (overwriteSeconds) {
          const chProgress = this.progress.challenges.find(
            (ch) => ch.challenge == this.challenge._id
          );
          const secondsPassed =
            (new Date(Date.now()).getTime() -
              new Date(chProgress.start_time).getTime()) /
            1000;
          const secondsLeft = Math.floor(
            this.challenge.seconds - secondsPassed
          );
          this.router.navigate(['session/search'], {
            state: { timeLeft: secondsLeft },
          });
        } else {
          this.router.navigate(['session/search']);
        }
      });
  }

  async finishPostTest() {
    let progress = this.progress;
    progress.challenges.forEach((chProgress) => {
      if (this.challenge._id == chProgress.challenge) {
        chProgress.post_test = true;
        chProgress.finished = true;
      }
    });
    this.authService
      .updateProgress({ challenges: progress.challenges })
      .then(() => {
        this.stage = 'summary';
      });
  }

  async finishSummary() {
    
    this.stage = 'play-again';
  }

  async finishPlayAgain(){
    this.load();
    this.router.navigate(['/']);
  }

  async continue(){
    this.load();
    this.router.navigate(['/start']);
  }

  getCurrentChallengeId() {
    const challenge = this.progress.challenges.find(
      (ch) => ch.finished == false
    );
    console.log(this.progress);
    console.log(challenge);
    if (challenge != null) return challenge.challenge;
    else return null;
  }
}
