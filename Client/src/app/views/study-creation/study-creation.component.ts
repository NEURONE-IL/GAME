import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidatorFn, ValidationErrors, AbstractControl } from '@angular/forms';
import { StudyService } from '../../services/game/study.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { AuthService, User} from 'src/app/services/auth/auth.service';
import {Observable} from 'rxjs';
import { StudyResourcesService } from 'src/app/services/admin/study-resources.service';

export function notThisUser(user): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if(user != null){
      control.markAsTouched();
      const isValid = user.email !== control.value;
      return isValid ? null : { 'notThisUser': true };
    }
    
  };
}
export function tagExist(tags): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if(tags != null && control.value != null){
      control.markAsTouched();
      const isValid = tags.some(tag => control.value.toLowerCase() === tag.toLowerCase());
      return isValid ? { 'tagExist': true }: null;
    }
    
  };
}

@Component({
  selector: 'app-study-creation',
  templateUrl: './study-creation.component.html',
  styleUrls: ['./study-creation.component.css']
})

export class StudyCreationComponent implements OnInit {
  studyForm: FormGroup;
  user: User;
  collaborators_selected: User[] = [];
  collaborator_selected: User;
  collaborator_status: boolean = false;
  filteredOptions: Observable<User[]>;
  privacies = [
    {privacy:"Público", value: false}, 
    {privacy:"Privado", value: true}
  ];

  hours: number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24];
  maxPers: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25];
  minutes: number[] = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];
  loading: boolean;
  file: File;

  languages: any[]
  tags: string[] = ['ejemplo'];
  levels: string[] = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
  competences: any[];


  constructor(
    private formBuilder: FormBuilder,
    private studyService: StudyService,
    private studyResourcesService: StudyResourcesService,
    private toastr: ToastrService,
    private translate: TranslateService,
    private router: Router,
    private authService: AuthService) { }

  ngOnInit(): void {
    this.user = this.authService.getUser();

    this.studyResourcesService.getCompetences().subscribe( response => {
      this.competences = response.competences;
      console.log(this.competences)
      this.competences.sort( (a,b) => a.name.localeCompare(b.name))
    }, err => {
      console.log(err)
    });

    this.studyResourcesService.getLanguages().subscribe( response => {
      this.languages = response.languages;
      console.log(this.languages)
      this.languages.sort( (a,b) => a.name.localeCompare(b.name))
    }, err => {
      console.log(err)
    });
    this.studyForm = this.formBuilder.group({
      description: ['', [Validators.minLength(3), Validators.maxLength(250)]],
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      hours: [''],
      minutes: [''],
      maxPerInterval: [''],
      
      privacy: ['', [Validators.required]],
      collaborators: ['', {validators: [Validators.email, notThisUser(this.user)], updateOn:'change'}],
      tags:['',[Validators.minLength(3), Validators.maxLength(15),tagExist(this.tags), Validators.nullValidator]],

      levels:[[],/*[Validators.required]*/],
      competences:[[],/*[Validators.required]*/],
      language:["Español",/*[Validators.required]*/]
    });
    console.log(this.studyFormControls.tags.value)
    this.loading = false;

  }

  get studyFormControls(): any {
    return this.studyForm['controls'];
  }

  resetForm() {
    this.tags = null;
    this.studyForm.reset();
  }
  changeStatus(event){
    this.collaborator_status = event.checked
  }

  verifyCollaborator(){
    let email = this.studyForm.value.collaborators;
    let emailExist: boolean;
    this.collaborators_selected.forEach(coll => {
      if(coll.email === email){
        emailExist = true;
        return
      }
        
    })
    if(emailExist || email === '' || this.studyFormControls.collaborators.status === 'INVALID'){
      return
    }
    let collaborator: User;
  
    this.authService.getUserbyEmail(email).subscribe(
      response => {
        collaborator = response['user']
        this.collaborators_selected.push(collaborator);
        this.studyFormControls.collaborators.setValue('');
        this.toastr.success(collaborator.email + " añadido exitosamente", "Éxito", {
          timeOut: 5000,
          positionClass: 'toast-top-center'});

      },
      (error) => {
          if(error === 'EMAIL_NOT_FOUND'){
            this.toastr.error("No se encuentra el correo ingresado, ingrese un correo de un usuario creador de contenido existente", "Usuario Inexistente", {
              timeOut: 5000,
              positionClass: 'toast-top-center'});
              return
            }

            if(error === 'ROLE_INCORRECT'){
            this.toastr.error("El usuario ingresado no cuenta con permisos de colaborador", "Usuario Incorrecto", {
              timeOut: 5000,
              positionClass: 'toast-top-center'});
              return
            }

            if(error === 'USER_NOT_CONFIRMED'){
            this.toastr.error("El usuario ingresado no ha terminado su proceso de registro", "Usuario no confirmado", {
              timeOut: 5000,
              positionClass: 'toast-top-center'});
              return
            }
      }
    );
  }
  addTag(){
    let tag = this.studyForm.value.tags;
    const value = (tag || '').trim();

    // Add our fruit
    if (value) {
      this.tags.push(value.toLowerCase());
      this.studyFormControls.tags.setValue('');
    }
  }
  removeCollaborator(user: User): void {
    console.log(this.collaborators_selected)
    const index = this.collaborators_selected.indexOf(user);

    if (index >= 0) {
      this.collaborators_selected.splice(index, 1);
    }
    console.log(this.collaborators_selected)

  }
  removeTag(tag: string): void {
    console.log(tag)
    const index = this.tags.indexOf(tag);

    if (index >= 0) {
      this.tags.splice(index, 1);
    }
    console.log(this.tags)

  }

  createStudy(){
    this.loading = true;
    let study = this.studyForm.value;
    let formData = new FormData();
    let collaborators = [];
    if(this.collaborators_selected.length > 0)
      this.collaborators_selected.forEach(coll => collaborators.push({user:coll, invitation:'Pendiente'}))
    
    console.log(collaborators);
    console.log(this.tags);

    formData.append('user', this.user._id); //Entregar ID del usuario
    formData.append('privacy', study.privacy);
    formData.append('collaborators', JSON.stringify(collaborators))
    formData.append('tags', JSON.stringify(this.tags))
    formData.append('name', study.name);
    formData.append('levels', JSON.stringify(study.levels));
    formData.append('competences', JSON.stringify(study.competences));
    formData.append('language', study.language);
    
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
    if(study.maxPerInterval){
      formData.append('max_per_interval', study.maxPerInterval)
    }
    formData.append('seconds', '0');
    if(this.file){
      formData.append('file', this.file);
    }

    
    this.studyService.postStudy(formData).subscribe(
      study => {
        console.log(study)
        this.authService.signupDummy(study.study._id).subscribe(
          user => {
            this.toastr.success(this.translate.instant("STUDY.TOAST.SUCCESS_MESSAGE") + ': ' + study['study'].name, this.translate.instant("STUDY.TOAST.SUCCESS"), {
              timeOut: 5000,
              positionClass: 'toast-top-center'
            });
            this.resetForm();
            this.loading = false;
            this.router.navigate(['admin_panel']);

          },
          err => {
            this.toastr.error(this.translate.instant("STUDY.TOAST.ERROR_MESSAGE"), this.translate.instant("STUDY.TOAST.ERROR"), {
              timeOut: 5000,
              positionClass: 'toast-top-center'
            });
          }
        )
      },
      err => {
        this.toastr.error(this.translate.instant("STUDY.TOAST.ERROR_MESSAGE"), this.translate.instant("STUDY.TOAST.ERROR"), {
          timeOut: 5000,
          positionClass: 'toast-top-center'
        });
      }
    );
  }

  handleFileInput(files: FileList) {
    this.file = files.item(0);
  }
}
