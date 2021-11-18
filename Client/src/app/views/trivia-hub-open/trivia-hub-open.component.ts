import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Study, StudyService } from 'src/app/services/game/study.service';
import { PlyrModule } from "ngx-plyr";
import openStudyLinks from 'src/assets/static/openStudiesLinks.json';

@Component({
  selector: 'app-trivia-hub-open',
  templateUrl: './index.html',
  styleUrls: ['./css/style.min.css', './trivia-hub-open.component.css']
})

export class TriviaHubOpenComponent implements OnInit {
  study: Study;
  containsStudy: Boolean;
  player: Plyr;
  studiesLinks: Array<Object> = openStudyLinks;
  courseSelected: String;

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
    localStorage.setItem('registeredVia', 'OpenInvitation');
  }

  played(event: Plyr.PlyrEvent) {
    console.log('played', event);

  }
  play(): void {
    this.player.play();
  }

}