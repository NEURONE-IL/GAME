import { Component, Inject, OnInit, ElementRef, ViewChild, OnDestroy, HostListener } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Study, StudyService } from '../../services/game/study.service';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, FormControl, ValidatorFn, ValidationErrors, AbstractControl } from '@angular/forms';
import { AuthService, User} from 'src/app/services/auth/auth.service';
import {Observable} from 'rxjs';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { StudyResourcesService } from 'src/app/services/admin/study-resources.service';

export interface Data{
  study: Study,
  userOwner: boolean
}
export function tagExist(tags): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if(tags != null){
      control.markAsTouched();
      const isValid = tags.some(tag => control.value.toLowerCase() === tag.toLowerCase());
      return isValid ? { 'tagExist': true }: null;
    }
    
  };
}

@Component({
  selector: 'app-study-update',
  templateUrl: 'study-update.component.html',
  styleUrls: ['./study-update.component.css']
})
export class StudyUpdateComponent implements OnInit,OnDestroy{
  studyForm: FormGroup;
  //Cambio Vale
  myControl = new FormControl();
  collaborators_users: User[];
  collaborators_selected: User[] = [];
  tags: String[] = [];
  collaborator_selected: User;
  privacies = [
    {privacy:"Público", value: false}, 
    {privacy:"Privado", value: true}
  ];
  edit_users : String[] = [];
  hours: number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24];
  maxPers: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25];
  minutes: number[] = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];
  loading: Boolean;
  file: File;

  userOwner: boolean;
  study: Study;
  user: User;

  languages :any[]
  levels: string[] = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
  competences: any[];

  edit_minutes: number = 5;
  timer_id: NodeJS.Timeout;
  timer: string = '5:00';
  timer_color: string = 'primary';  

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: Data,
    private formBuilder: FormBuilder,
    private studyService: StudyService,
    private studyResourcesService: StudyResourcesService,
    private toastr: ToastrService,
    private translate: TranslateService,
    public matDialog: MatDialog,
    private authService: AuthService) { 
      this.study = this.data.study;
      this.userOwner = this.data.userOwner;
    }

  ngOnInit(): void {
    this.studyResourcesService.getCompetences().subscribe( response => {
      this.competences = response.competences;
      console.log(this.competences)
      this.competences.sort( (a,b) => a.name.localeCompare(b.name))
    }, err => {
      console.log(err)
    })
    this.studyResourcesService.getLanguages().subscribe( response => {
      this.languages = response.languages;
      console.log(this.languages)
      this.languages.sort( (a,b) => a.name.localeCompare(b.name))
    }, err => {
      console.log(err)
    })
    /*Gets the cooldown in seconds and converts it to hours and minutes*/
    let seconds = this.study.cooldown;
    let hours = Math.trunc(seconds/3600);
    let minutes = Math.trunc(seconds/60)%60;
    /*End*/
    this.tags = this.study.tags.slice();
    let filteredCompetences :any[] = []
      this.study.competences.forEach(comp => {
        filteredCompetences.push(comp._id)
      });
    this.studyService.closeEventSource();
    this.user = this.authService.getUser();

    this.studyForm = this.formBuilder.group({
      description: [this.study.description, [Validators.minLength(3), Validators.maxLength(250)]],
      name: [this.study.name, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      hours: [hours || ''],
      minutes: [minutes || ''],
      maxPerInterval: [this.study.max_per_interval || '', Validators.required],
      //Vale
      privacy: this.study.privacy,
      collaborators: this.study.collaborators,
      tags:['',[Validators.minLength(3), Validators.maxLength(15), tagExist(this.tags)]],

      levels:[this.study.levels,/*[Validators.required]*/],
      competences:[filteredCompetences,/*[Validators.required]*/],
      language:[this.study.language,/*[Validators.required]*/]
    });

    this.requestEdit();
        
    this.loading = false;
  }
  ngOnDestroy(): void{
    clearInterval(this.timer_id);
    this.studyService.closeEventSource();
    this.releaseStudy();
  }
  @HostListener('window:beforeunload', ['$event'])
  doSomething($event){
    this.ngOnDestroy();
  }
  countdown(){
    var time: number = this.edit_minutes * 60 - 1;
    this.timer_id = setInterval(() => {
      if(time >= 0){
        const minutes = Math.floor(time / 60);
        var seconds = time % 60;
        var displaySeconds = (seconds < 10) ? "0" + seconds : seconds;
        this.timer = minutes + ":" + displaySeconds;
        time--;
        if(time == 60)
          this.timer_color = 'warn';
      }
      else{
        this.matDialog.closeAll();
        clearInterval(this.timer_id);
      }
    }, 1000);
  }

  get studyFormControls(): any {
    return this.studyForm['controls'];
  }

  resetForm() {
    this.studyForm.reset();
  }

  addTag(){
    let tag = this.studyForm.value.tags;
    const value = (tag || '').trim();

    if (value && !(this.studyFormControls.tags.status === 'INVALID')) {
      this.tags.push(value.toLowerCase());
      this.studyFormControls.tags.setValue('');
    }
  }
  removeCollaborator(user: User): void {
    const index = this.collaborators_selected.indexOf(user);

    if (index >= 0) {
      this.collaborators_selected.splice(index, 1);
    }
  }
  removeTag(tag: String): void {
    console.log(tag)
    const index = this.tags.indexOf(tag);

    if (index >= 0) {
      this.tags.splice(index, 1);
    }
    console.log(this.tags)

  }
  
  updateStudyField(){
    this.tags = this.study.tags.slice();
    let seconds = this.study.cooldown;
    let hours = Math.trunc(seconds/3600);
    let minutes = Math.trunc(seconds/60)%60;
    let filteredCompetences :any[] = [];

    this.study.competences.forEach(comp => {
      filteredCompetences.push(comp._id)
    });
    this.studyForm.controls['name'].setValue(this.study.name);
    this.studyForm.controls['description'].setValue(this.study.description);
    this.studyForm.controls['maxPerInterval'].setValue(this.study.max_per_interval);
    this.studyForm.controls['privacy'].setValue(this.study.privacy);
    this.studyForm.controls['collaborators'].setValue(this.study.collaborators);
    this.studyForm.controls['hours'].setValue(hours);
    this.studyForm.controls['minutes'].setValue(minutes);
    this.studyForm.controls['levels'].setValue(this.study.levels);
    this.studyForm.controls['language'].setValue(this.study.language);
    this.studyForm.controls['competences'].setValue(filteredCompetences);

  }
  updateStatusForm(state: number){
    let user_id = this.authService.getUser()._id;
    if(!(this.edit_users[0] === user_id)){
      console.log('No puede editar')
      this.studyForm.disable();
      this.studyForm.controls.privacy.disable();
      this.toastr.warning('El estudio está siendo editado por alguien más, una vez que el usuario termine, podrá editarlo', 'Advertencia', {
        timeOut: 5000,
        positionClass: 'toast-top-center'
      });
    }
    else if(this.edit_users[0] === user_id){
      console.log('Puede editar!')
      this.countdown();
      this.studyForm.enable();
      if (this.userOwner) {
        this.studyForm.controls.privacy.enable();
      } else {
        this.studyForm.controls.privacy.disable();
      }
      if(state != 1){
        this.getStudy();
        this.toastr.info('El estudio puede ser editado ahora', 'Información', {
          timeOut: 5000,
          positionClass: 'toast-top-center'
        });
      }
    }
  }

  requestEdit(){
    let user_id = this.authService.getUser()._id;
    this.studyService.requestForEdit(this.study._id,{user:user_id}).subscribe(
      response => {
        this.edit_users = response.users;
        this.updateStatusForm(1)
        if(this.edit_users[0] != user_id){
          this.studyService.getServerSentEvent(this.study._id, user_id).subscribe(
            response => {
              let data = JSON.parse(response.data);
              console.log(data);
              this.edit_users = data.currentUsers;
              if(this.edit_users[0] === user_id){
                this.updateStatusForm(0);
                this.studyService.closeEventSource();
              }
            },
            err => {
              console.log(err)
            });
        }
      },
      err => {
        console.log(err);
      }
    )
  }
  releaseStudy(){
    let user_id = this.authService.getUser()._id;
    this.studyService.releaseForEdit(this.study._id, {user:user_id}).subscribe(
      study => {
        console.log('Study Release');
      },
      err => {
        console.log(err)
      }
    );
  }
  getStudy(){
    this.studyService.getStudy(this.study._id).subscribe(
      response => {
        console.log(response.study);
        this.study = response.study;
        this.updateStudyField();
    }, 
    err => {
      console.log(err)
    })
  }

  updateStudy(studyId: string){
    this.loading = true;
    let study = this.studyForm.value;
    let formData = new FormData();
    let user = this.authService.getUser();
    
    console.log(study.competences);
    
    if (this.userOwner) {
      formData.append('privacy', study.privacy);
    } else {
      formData.append('privacy', JSON.stringify(this.study.privacy));
    }
    formData.append('collaborators', JSON.stringify(this.study.collaborators));
    formData.append('tags', JSON.stringify(this.tags));
    formData.append('name', study.name);
    formData.append('levels', JSON.stringify(study.levels));
    formData.append('competences', JSON.stringify(study.competences));
    formData.append('language', study.language);
    formData.append('user_edit', user._id);
    
    if(study.description){
      formData.append('description', study.description);
    }
    if(study.hours !== ''){
      formData.append('hours', study.hours.toString());
    }else{
      formData.append('hours', '0');
    }
    if(study.minutes !== ''){
      formData.append('minutes', study.minutes.toString());
    }else{
      formData.append('minutes', '0');
    }
    formData.append('seconds', '0');
    if(study.maxPerInterval){
      formData.append('max_per_interval', study.maxPerInterval);
    }
    if(this.file){
      formData.append('file', this.file);
    }
    this.studyService.putStudy(studyId, formData).subscribe(
      study => {
        this.toastr.success(this.translate.instant("STUDY.TOAST.SUCCESS_MESSAGE_UPDATE") + ': ' + study['study'].name, this.translate.instant("STUDY.TOAST.SUCCESS"), {
          timeOut: 5000,
          positionClass: 'toast-top-center'
        });
        this.loading = false;
        this.matDialog.closeAll();
      },
      err => {
        this.toastr.error(this.translate.instant("STUDY.TOAST.ERROR_MESSAGE_UPDATE"), this.translate.instant("STUDY.TOAST.ERROR"), {
          timeOut: 5000,
          positionClass: 'toast-top-center'
        });
      }
    );
    this.loading = false;
  }

  handleFileInput(files: FileList) {
    this.file = files.item(0);
  }
}