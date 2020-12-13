import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Challenge, ChallengeService } from '../../services/game/challenge.service';
import { Study, StudyService } from '../../services/game/study.service';

@Component({
  selector: 'app-study-display',
  templateUrl: './study-display.component.html',
  styleUrls: ['./study-display.component.css']
})
export class StudyDisplayComponent implements OnInit {
  study: Study;
  challenges: Challenge[];

  constructor(private router: Router, private route: ActivatedRoute, private challengeService: ChallengeService, private studyService: StudyService) { }

  ngOnInit(): void {

    this.studyService.getStudy(this.route.snapshot.paramMap.get('study_id'))
      .subscribe(response => this.study = response['study']);

    this.challengeService.getChallengesByStudy(this.route.snapshot.paramMap.get('study_id'))
      .subscribe(response => this.challenges = response['challenges']);

    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  };
  CreateChallenge(){
    this.router.navigate(['create/challenge']);
  }
  BackToStudies(){
    this.router.navigate(['admin_panel']);
  }
}
