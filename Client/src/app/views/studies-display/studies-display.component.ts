import { Component, OnInit } from '@angular/core';
import { Study, StudyService } from '../../services/game/study.service';

@Component({
  selector: 'app-studies-display',
  templateUrl: './studies-display.component.html',
  styleUrls: ['./studies-display.component.css']
})
export class StudiesDisplayComponent implements OnInit {
  studies: Study[];

  constructor(private studyService: StudyService) { }

  ngOnInit(): void {

    this.studyService.getStudies()
      .subscribe(response => this.studies = response['studys']);    

  }

  getCover(index: number): string{
    return '../../../assets/study-images/Study0' + (index%8+1) + '.jpg';
  }

}
