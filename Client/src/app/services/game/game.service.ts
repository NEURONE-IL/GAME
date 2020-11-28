import { Injectable } from '@angular/core';
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
  loadingGameData: true;

  constructor(private authService: AuthService, private challengeService: ChallengeService, private studyService: StudyService) {
    this.loadGameData();
   }

  loadGameData() {
    this.player = this.authService.getUser();
    this.studyService.getStudy(this.player.study)
      .subscribe((resp: any) => {
        this.study = resp.study;
      },
      (error: any) => console.log(error));

    this.challengeService.getChallengesByStudy(this.player.study)
      .subscribe((resp: any) => {
        this.challenges = resp.challenges;
        this.currentChallenge = 0;
      },
      (error: any) => console.log(error));
  }

  nextChallenge() {
    if(this.currentChallenge+1<this.challenges.length) {
      this.currentChallenge = this.currentChallenge + 1;
    }
    else {
      console.log('no more challenges');
    }
  }

  printGameData() {
    console.log(this.player);
    console.log(this.study);
    console.log(this.challenges);
    console.log(this.currentChallenge);
  }
}
