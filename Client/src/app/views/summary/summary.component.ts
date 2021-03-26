import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ChallengeService } from 'src/app/services/game/challenge.service';
import { GameService } from 'src/app/services/game/game.service';
import { GamificationService } from 'src/app/services/game/gamification.service';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.css']
})
export class SummaryComponent implements OnInit {

  constructor(private gamificationService: GamificationService,  private authService: AuthService,private gameService: GameService, private challengeService: ChallengeService) { }
  progress
  nearLevel
  answer
  connected = false;
  ngOnInit(): void {
      this.connected = true;
      this.levelProgress();
      this.getAnswer();

  }

  levelProgress(){
    this.gamificationService.userLevelProgress(this.authService.getUser()._id).subscribe(
      response => {
        this.progress = response;
        this.nearLevel = this.progress[0];
        for(let i = 1; i<this.progress.length; i++){
          if(this.progress[i].point_threshold < this.nearLevel.point_threshold){
            this.nearLevel = this.progress[i];
          }
        }
        document.getElementById("progressLevel").setAttribute("data-label", this.nearLevel.amount + '/' + this.nearLevel.point_threshold+' '+ this.nearLevel.point.name);
        document.getElementById("progressValue").style.width = this.nearLevel.amount/this.nearLevel.point_threshold*100+'%'

      },
      err => {
        console.log(err)
      }
    );
  }

  getAnswer(){
    this.challengeService.lastUserAnswer().subscribe(
      response => {
        this.answer = response;
      },
      err => {
        console.log(err)
      }
    )
  }

  async continue(){
    await this.gameService.finishSummary();
    this.gameService.finishChallenge();
  }

}
