import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Study, StudyService } from 'src/app/services/game/study.service';
import {PlyrModule} from "ngx-plyr";


@Component({
  selector: 'app-trivia-hub',
  templateUrl: './index.html',
  styleUrls: ['./css/style.min.css', './trivia-hub.component.css']
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
  player: Plyr;

  videoSources: Plyr.Source[] = [
    {
      src: '/assets/welcomeVideos/Funcionamiento_Trivia_Apoderados.mp4',
    },
  ];

  videoSources2: Plyr.Source[] = [
    {
      src: '/assets/welcomeVideos/Estudiante3.mp4',
    },
  ];

  videoSources3: Plyr.Source[] = [
    {
      src: '/assets/welcomeVideos/Bienvenida_Trivia.mp4',
    },
  ];
  constructor( private router: Router,
               private route: ActivatedRoute,
               private studyService: StudyService,
               private toastr: ToastrService,
               private translate: TranslateService,
               private plyrModule: PlyrModule
             ) { }

  ngOnInit(): void {
    let study = this.route.snapshot.paramMap.get('study_id');
    if(study){
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
    else if(localStorage.getItem('study_id')){
      study = localStorage.getItem('study_id');
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

  played(event: Plyr.PlyrEvent) {
    console.log('played', event);

  }
  play(): void {
    this.player.play();
  }

}

