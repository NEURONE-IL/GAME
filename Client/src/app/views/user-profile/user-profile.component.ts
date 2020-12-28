import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { GamificationService } from 'src/app/services/game/gamification.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  progress
  nearLevel
  completedChallenges
  actualLevel
  constructor(private gamificationService: GamificationService,  private authService: AuthService) { }

  ngOnInit(): void {
    this.levelProgress();
    this.getCompletedChallenges();
    this.getLevels();
  }

  getCompletedChallenges(){
    this.gamificationService.userCompletedChallenges(this.authService.getUser()._id).subscribe(
      response => {
        this.completedChallenges = response;
        for(let i = 0; i<this.completedChallenges.length; i++){
          this.completedChallenges[i].dateDisplay = new Date(this.completedChallenges[i].completion_date).toLocaleDateString();
        }
      },
      err => {
        console.log(err)
      }
    );
  }

  getLevels(){
    this.gamificationService.userLevel(this.authService.getUser()._id).subscribe(
      response => {
        let levels = response;
        this.actualLevel = levels[0];
        for(let i = 0; i<levels.length; i++){
          if(levels[i].point_threshold < this.actualLevel.point_threshold){
            this.actualLevel = levels[i];
          }
        }
      },
      err => {
        console.log(err)
      }
    );
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

}
