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
  activePage: number= 0;


  constructor(
    private challengeService: ChallengeService,
    public router: Router,
    public authService: AuthService
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
    if(this.progress.finished && this.progress.post_study){
      this.canPlay = { canPlay: false };
      this.stage = 'study-finished'
      this.loading = false;
    }
    else if(this.progress.finished && !this.progress.post_study){
      this.canPlay = { canPlay: false };
      this.stage = 'post-study'
      this.loading = false;
    }    
    else{
      // For one challenge at once
      const challengeId = this.getCurrentChallengeId();
      if (challengeId != null) {
        localStorage.setItem('chall', challengeId);
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
  }

  setActivePage(activePage){
    this.activePage= Number(activePage);
    console.log("the result page is: ", this.activePage);

  }
  getActivePage(){
    return this.activePage
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
        if(!this.authService.getUser().trainer_id){
          this.stage = 'summary';
        }
        else{
          this.finishSummary();
        }
        localStorage.setItem('value', "100")
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
//        this.stage = 'instructions';
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
        if(!this.authService.getUser().trainer_id){
          this.stage = 'summary';
        }
        else{
          window.location.href = this.authService.getUser().trainer_return_url;
        }
      });
  }

  async finishPostStudy() {
    this.authService
      .updateProgress({ post_study: true })
      .then(() => {
        this.stage = 'study-finished';
        this.router.navigate(['start']);
      });
  }

  async finishSummary() {
    localStorage.removeItem('chall')
    let progress = this.progress;
    let studyFinished = true;
    progress.challenges.forEach((chProgress) => {
      if (!chProgress.finished ) {
        studyFinished = false;
      }
    });
    if(studyFinished){
      await this.authService.updateProgress({ finished: true });
      this.stage = 'post-study';
    }
    else{
      this.canPlay = await this.authService.canPlay();
      if(this.canPlay["canPlay"]){
        this.stage = 'play-again';
      }
      else{
        this.stage = 'no-play-again';
      }
    }
  }

  async finishPlayAgain(){
    this.load();
    const user = this.authService.getUser();
    if(user.trainer_id !== null){
      window.location.href = user.trainer_return_url;
    }
    else{
      this.router.navigate(['/']);
    }
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

  getUrl(){
    return localStorage.getItem('return_url');
  }

}
