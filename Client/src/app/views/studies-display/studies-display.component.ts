import {Component, EventEmitter, OnInit, Output, Input} from '@angular/core';
import { Study, StudyService } from '../../services/game/study.service';
import {Router} from '@angular/router';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-studies-display',
  templateUrl: './studies-display.component.html',
  styleUrls: ['./studies-display.component.css']
})
export class StudiesDisplayComponent implements OnInit {
  studies: Study[] = [];

  constructor(private studyService: StudyService, private router: Router, private toastr: ToastrService, private translate: TranslateService) { }

  ngOnInit(): void {

    this.studyService.getStudies().subscribe(
      response => {
        this.studies = response['studys'];
      },
      err => {
        this.toastr.error(this.translate.instant("STUDY.TOAST.NOT_LOADED_MULTIPLE_ERROR"), this.translate.instant("CHALLENGE.TOAST.ERROR"), {
          timeOut: 5000,
          positionClass: 'toast-top-center'
        });
      }
    );
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
