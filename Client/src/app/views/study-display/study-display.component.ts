import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Challenge, ChallengeService } from '../../services/game/challenge.service';
import { Study, StudyService } from '../../services/game/study.service';

@Component({
  selector: 'app-study-display',
  templateUrl: './study-display.component.html',
  styleUrls: ['./study-display.component.css']
})
export class StudyDisplayComponent implements OnInit {
  study: Study;
  challenges: Challenge[] = [];

  constructor(private router: Router, private route: ActivatedRoute, private challengeService: ChallengeService, private studyService: StudyService, private toastr: ToastrService, private translate: TranslateService) { }

  ngOnInit(): void {

    this.studyService.getStudy(this.route.snapshot.paramMap.get('study_id'))
      .subscribe(response => this.study = response['study']);

    this.challengeService.getChallengesByStudy(this.route.snapshot.paramMap.get('study_id'))
      .subscribe(response => this.challenges = response['challenges']);

    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  CreateChallenge(){
    this.router.navigate(['create/challenge']);
  }

  BackToStudies(){
    this.router.navigate(['admin_panel']);
  }

  deleteChallenge(id: string){
    this.challengeService.deleteChallenge(id)
      .subscribe(challenge => {
        this.challengeService.getChallengesByStudy(this.route.snapshot.paramMap.get('study_id'))
          .subscribe(response => this.challenges = response['challenges']);
        this.toastr.success(this.translate.instant("CHALLENGE.TOAST.SUCCESS_MESSAGE_DELETE"), this.translate.instant("CHALLENGE.TOAST.SUCCESS"), {
          timeOut: 5000,
          positionClass: 'toast-top-center'
        });
      },
      err => {
        this.toastr.error(this.translate.instant("CHALLENGE.TOAST.ERROR_MESSAGE_DELETE"), this.translate.instant("CHALLENGE.TOAST.ERROR"), {
          timeOut: 5000,
          positionClass: 'toast-top-center'
        });
      }
    );
  }

  updateChallenge(id: string, updatedChallenge: string){
    this.challengeService.putChallenge(id, updatedChallenge)
    .subscribe(challenge => {
      this.challengeService.getChallengesByStudy(this.route.snapshot.paramMap.get('study_id'))
        .subscribe(response => this.challenges = response['challenges']);
        this.toastr.success(this.translate.instant("CHALLENGE.TOAST.SUCCESS_MESSAGE_UPDATE") + challenge['challenge'].question, this.translate.instant("CHALLENGE.TOAST.SUCCESS"), {
          timeOut: 5000,
          positionClass: 'toast-top-center'
        });
      },
      err => {
        this.toastr.error(this.translate.instant("CHALLENGE.TOAST.ERROR_MESSAGE_UPDATE"), this.translate.instant("CHALLENGE.TOAST.ERROR"), {
          timeOut: 5000,
          positionClass: 'toast-top-center'
        });
      }
    );
  }
  getClass(type){
    console.log(type);
    if (type=="page"){
      return "webPage";
    }
    else if(type=="video"){
      return "video"
    }
    else if(type=="image"){
      return "image"
    }else{
      return "document"
    }
  }
  getClassQuestion(type){
    if (type=="page"){
      return "CHALLENGE.QUESTION_TYPE.PAGE";
    }
    else if(type=="video"){
      return "CHALLENGE.QUESTION_TYPE.IMAGE"
    }
    else if(type=="image"){
      return "CHALLENGE.QUESTION_TYPE.DOCUMENT"
    }else{
      return "CHALLENGE.QUESTION_TYPE.VIDEO"
    }
  }
  formatDate(date){
    return date.substr(0,10);
  }
}
