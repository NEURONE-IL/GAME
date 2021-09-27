import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Study, StudyService } from 'src/app/services/game/study.service';

@Component({
  selector: 'app-trivia-hub',
  templateUrl: './index.html',
  styleUrls: ['./css/style.min.css']
})

/*export class TriviaHubComponent implements OnInit {
  containsStudy: Boolean;

  constructor( private router: Router) { }

  ngOnInit(): void {
    if(this.router.url.toString().split("/").length > 2){
      this.containsStudy = true;
    }
  }

  getStudy(){
    let urlArray = this.router.url.toString().split("/");
    let study = urlArray[urlArray.length - 1]
    return '/signup/' + study;
  }

}*/

export class TriviaHubComponent implements OnInit {
  study: Study;
  containsStudy: Boolean;

  constructor( private router: Router, 
               private studyService: StudyService,
               private toastr: ToastrService,
               private translate: TranslateService
             ) { }

  ngOnInit(): void {
    if(localStorage.getItem('study_id')){
      let study = localStorage.getItem('study_id');
      this.studyService.getStudy(study).subscribe(
        response => {
          if(response['study']){
            this.study = response['study'];
            this.containsStudy = true;
            localStorage.setItem('study_id', this.study._id);
          };
        },
        err => {
          this.toastr.error(this.translate.instant("STUDY.TOAST.WELCOME_ERROR"), this.translate.instant("STUDY.TOAST.ERROR"), {
            timeOut: 5000,
            positionClass: 'toast-top-center'
          });
        }
      );
    }
    if(this.router.url.toString().split("/").length > 2){
      let urlArray = this.router.url.toString().split("/");
      let study = urlArray[urlArray.length - 1];
      this.studyService.getStudy(study).subscribe(
        response => {
          if(response['study']){
            this.study = response['study'];
            this.containsStudy = true;
            localStorage.setItem('study_id', this.study._id);
          };
        },
        err => {
          this.toastr.error(this.translate.instant("STUDY.TOAST.WELCOME_ERROR"), this.translate.instant("STUDY.TOAST.ERROR"), {
            timeOut: 5000,
            positionClass: 'toast-top-center'
          });
        }
      );
    }
  }

  getStudy(){
    return '/signup/' + localStorage.getItem('study_id');
  }

}

