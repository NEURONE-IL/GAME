import {Component, EventEmitter, OnInit, Output, Input} from '@angular/core';
import { Study, StudyService } from '../../services/game/study.service';
import {Router} from '@angular/router';
@Component({
  selector: 'app-studies-display',
  templateUrl: './studies-display.component.html',
  styleUrls: ['./studies-display.component.css']
})
export class StudiesDisplayComponent implements OnInit {
  studies: Study[] = [];

  constructor(
    private studyService: StudyService, private router: Router) { }

  ngOnInit(): void {

    this.studyService.getStudies()
      .subscribe(response => this.studies = response['studys']);

  }

  getCover(index: number): string{
    return '../../../assets/study-images/Study0' + (index%8+1) + '.jpg';
  }

  CreateStudy(){
    this.router.navigate(['create/study']);
  }

  @Output() studySelected: EventEmitter<string>= new EventEmitter();
  clickedStudy(id){
    let link = '/admin_panel/study/'+ id;
    this.studySelected.emit(link);
    /* this.router.navigate([link]); */
  }

  actualStudy='';
  fullStudy(study){
    this.actualStudy= study._id;
  }
  shortStudy(study){
    this.actualStudy= '';
  }

  showShortDescription(description){
      return (description.substr(0, 40));
  }
}
