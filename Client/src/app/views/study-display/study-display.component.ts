import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Challenge, ChallengeService } from '../../services/game/challenge.service';
import { Study, StudyService } from '../../services/game/study.service';
import {MatExpansionModule} from '@angular/material/expansion' ;
@Component({
  selector: 'app-study-display',
  templateUrl: './study-display.component.html',
  styleUrls: ['./study-display.component.css']
})
export class StudyDisplayComponent implements OnInit {
  study: Study;
  challenges: Challenge[] = [];
  createChallenge: boolean;
  verDocumentos: boolean;
  constructor(private router: Router, private route: ActivatedRoute, private challengeService: ChallengeService, private studyService: StudyService, private toastr: ToastrService, private translate: TranslateService) { }

  ngOnInit(): void {
    this.createChallenge = false;
    this.verDocumentos = false;
    this.studyService.getStudy(this.route.snapshot.paramMap.get('study_id'))
      .subscribe(response => this.study = response['study']);

    this.challengeService.getChallengesByStudy(this.route.snapshot.paramMap.get('study_id'))
      .subscribe(response => this.challenges = response['challenges']);

    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }
  BackToChallenges(){
    this.createChallenge = false;
    this.verDocumentos = false;
    this.challenges=[];
    this.challengeService.getChallengesByStudy(this.route.snapshot.paramMap.get('study_id'))
      .subscribe(response => this.challenges = response['challenges']);
  }

  CreateChallenge(){
    this.createChallenge = true;

    /* this.router.navigate(['create/challenge']); */

  }

  BackToStudies(){
    this.router.navigate(['admin_panel']);
  }

  confirmDelete(id: string){
    confirm(this.translate.instant("ADMIN.CHALLENGES.DELETE_CONFIRMATION")) && this.deleteChallenge(id);
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
      return "CHALLENGE.QUESTION_TYPE.VIDEO"
    }
    else if(type=="image"){
      return "CHALLENGE.QUESTION_TYPE.IMAGE"
    }else{
      return "CHALLENGE.QUESTION_TYPE.DOCUMENT"
    }
  }
  formatDate(date){
    return date.substr(0,10);
  }

  manageDocuments(){
    this.verDocumentos = true;
    return null;
  }
}
