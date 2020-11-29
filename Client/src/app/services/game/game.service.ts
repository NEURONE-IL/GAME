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

  constructor(private authService: AuthService, private challengeService: ChallengeService, private studyService: StudyService) { }

  async loadGameData() {
    await new Promise(r => setTimeout(r, 1000)); // For testing purposes only
    this.player = this.authService.getUser();
    this.study = await this.studyService.getStudy(this.player.study).toPromise();
    this.study = this.study.study;
    this.challenges = await this.challengeService.getChallengesByStudy(this.player.study).toPromise();
    this.challenges = this.challenges.challenges;
    this.currentChallenge = 0;
    console.log('done loading game data');
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
