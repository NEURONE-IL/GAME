import {Component, EventEmitter, OnInit, Output, Input} from '@angular/core';
import { Study, StudyService } from '../../services/game/study.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { User, AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-studies-display',
  templateUrl: './studies-display.component.html',
  styleUrls: ['./studies-display.component.css']
})
export class StudiesDisplayComponent implements OnInit {
  studies: Study[] = [];
  user: User;
  noStudies: boolean = false;
  indexTab:number = 0;

  constructor(private studyService: StudyService, private router: Router, private toastr: ToastrService, private translate: TranslateService, private authService: AuthService) { }

  ngOnInit(): void {
    this.user = this.authService.getUser();
    this.getAllStudiesByUser();

      
  }
  //Se traen los estudios de un usuario filtrando por privacidad
  getAllStudiesByUser(){
    this.studyService.getStudiesByUser(this.user._id).subscribe(
      response => { 
        this.studies = response['studies'];
        if(this.studies.length <= 0)
          this.noStudies = true
        else
          this.noStudies = false

      },
      err => {
        this.toastr.error(this.translate.instant("STUDY.TOAST.NOT_LOADED_MULTIPLE_ERROR"), this.translate.instant("CHALLENGE.TOAST.ERROR"), {
          timeOut: 5000,
          positionClass: 'toast-top-center'
        });
      }
    );
  }
  getStudiesByPrivacy(priv): void {
    let params = {user: this.user._id, privacy: priv};
    this.studyService.getStudiesByUserByPrivacy(params).subscribe(
      response => {
        this.studies = response['studies'];
        if(!(this.studies.length > 0) )
          this.noStudies = true;
        else
          this.noStudies = false;
      },
      err => {
        this.toastr.error(this.translate.instant("STUDY.TOAST.NOT_LOADED_MULTIPLE_ERROR"), this.translate.instant("CHALLENGE.TOAST.ERROR"), {
          timeOut: 5000,
          positionClass: 'toast-top-center'
        });
      }
    );
  }
  getStudiesByType(type: string): void {
    let params = {user: this.user._id, type: type};
    this.studyService.getStudiesByUserByType(params).subscribe(
      response => {
        this.studies = response['studies'];
        if(!(this.studies.length > 0) )
          this.noStudies = true;
        else
          this.noStudies = false;
      },
      err => {
        this.toastr.error(this.translate.instant("STUDY.TOAST.NOT_LOADED_MULTIPLE_ERROR"), this.translate.instant("CHALLENGE.TOAST.ERROR"), {
          timeOut: 5000,
          positionClass: 'toast-top-center'
        });
      }
    );
  }

  getStudiesByCollaboration(): void {
    this.studyService.getStudiesByUserCollaboration(this.user._id).subscribe(
      response => {
        this.studies = response['studies'];
        if(!(this.studies.length > 0) )
          this.noStudies = true;
        else
          this.noStudies = false;
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

  //Se despliegan eventos según el tab seleccionado
  onTabClick(event) {
    let index = event.index
    this.indexTab = index;
    switch(index) { 
      case 0: { 
        this.getAllStudiesByUser(); 
        break; 
      } 
      case 1: { //Privados
        var privacy = true;
        this.getStudiesByPrivacy(privacy); 
        break; 
      } 
      case 2: { //Publicos
        var privacy = false;
        this.getStudiesByPrivacy(privacy); 
        break; 
      } 
      case 3: { 
        var type = 'clone'
        this.getStudiesByType(type)
        console.log('1');
        break; 
      }
      case 4: { 
        this.getStudiesByCollaboration();
        break; 
      }
      default: { 
         //statements; 
         break; 
      } 
   }
  }
}
