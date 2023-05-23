import {Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { FormControl, Validators, ValidatorFn, ValidationErrors, AbstractControl, Form } from '@angular/forms';
import { Challenge, ChallengeService } from '../../services/game/challenge.service';
import { Collaborators, Study, StudyService } from '../../services/game/study.service';
import { EndpointsService, Resource} from '../../services/endpoints/endpoints.service';
import { environment } from 'src/environments/environment';
import { MatDialog, MatDialogState } from '@angular/material/dialog';
import { User, AuthService } from 'src/app/services/auth/auth.service';
import { MatSort } from "@angular/material/sort";
import { StudyUpdateComponent } from '../study-update/study-update.component';
import { ChallengeUpdateComponent } from '../challenge-update/challenge-update.component';
import { MatTable } from '@angular/material/table';
import { History, HistoryService } from '../../services/admin/history.service';


export interface Section {
  name: string;
  updated: Date;
}
export function notExistingColl(collaborators): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if(collaborators != null){
      let notExist: boolean = true;

      collaborators.filter( coll => {
        if(coll.user.email === control.value){
          notExist = false
        }
      })
      return notExist ? null : { 'notExistingColl': true };
    }
    
  };
}

export function notThisUser(user): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if(user != null){
      control.markAsTouched();
      const isValid = user.email !== control.value;
      return isValid ? null : { 'notThisUser': true };
    }
    
  };
}

@Component({
  selector: 'app-study-display',
  templateUrl: './study-display.component.html',
  styleUrls: ['./study-display.component.css'],

})

export class StudyDisplayComponent implements OnInit {
  
  collaboratorsExist: boolean = false;
  createChallenge: boolean;
  deletingResource: boolean;
  dummyExists: boolean = false;
  searchView: boolean;
  resources_status: boolean = false;
  verDocumentos: boolean;
  wasClone: boolean = false;
  challenges: Challenge[] = [];  
  filteredResources: Resource[] = [];
  study: Study;
  resources: Resource[] = [];
  cloneHistory: History[];
  user: User;
  userOwner: boolean = true;
  registerLink: string;
  value: string;
  edit_minutes: number = 3;

  emailFormControl: FormControl;
  loadingClone: boolean = false;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private challengeService: ChallengeService,
              private studyService: StudyService,
              private authService: AuthService,
              private historyService: HistoryService,
              private toastr: ToastrService,
              private translate: TranslateService,
              public endpointsService: EndpointsService,
              public matDialog: MatDialog
              ) { }

  ngOnInit(): void {
    this.createChallenge = false;
    this.verDocumentos = false;
    this.searchView = false;
    this.user = this.authService.getUser();

    this.studyService.getStudy(this.route.snapshot.paramMap.get('study_id')).subscribe(
      response => {
        this.study = response['study'];
        this.emailFormControl = new FormControl('', [Validators.email,notThisUser(this.user),notExistingColl(this.study.collaborators)]);

        let _user_id = this.user._id
    
        
        this.registerLink = environment.frontURL + 'welcome/' + this.study._id;
        if (this.study.collaborators.length>0)
          this.collaboratorsExist = true;
        if(!(_user_id == this.study.user._id))
        {
          this.userOwner = false;
        }

        this.findDummy();
      },
      err => {
        this.toastr.error(this.translate.instant("STUDY.TOAST.NOT_LOADED_ERROR"), this.translate.instant("CHALLENGE.TOAST.ERROR"), {
          timeOut: 5000,
          positionClass: 'toast-top-center'
        });
      }
    );

    this.challengeService.getChallengesByStudy(this.route.snapshot.paramMap.get('study_id'))
      .subscribe(response => {
        this.challenges = response['challenges'];
    });
    
    this.endpointsService.getDocuments('*', this.route.snapshot.paramMap.get('study_id'))
      .subscribe((response: Resource[]) => {
        this.resources = response;
        this.filteredResources = this.resources.filter(resource => resource.type != 'image');
        this.getAllChallengeResources();
        this.resources_status = true;
      })
    
      this.historyService.getHistoryByStudyByType(this.route.snapshot.paramMap.get('study_id'),'clone').subscribe(
        response => {
          this.cloneHistory = response['histories'];

          if (this.cloneHistory.length>0){
            this.cloneHistory.forEach( history => {

              let d = new Date(history.createdAt);
              let date = (d.getDate() < 10? '0':'') + d.getDate() + (d.getMonth() < 10 ? '/0' : '/') + (d.getMonth() + 1) + '/' + d.getFullYear();          
              let hour = (d.getHours() < 10 ? '0' : '') +d.getHours() + ':' + (d.getMinutes() < 10 ? '0' : '')+ d.getMinutes();
              history.createdAt = date + ' ' + hour;
            })
            this.wasClone = true;

          }
          this.findDummy();
        },
        err => {
          this.toastr.error(this.translate.instant("STUDY.TOAST.NOT_LOADED_ERROR"), this.translate.instant("CHALLENGE.TOAST.ERROR"), {
            timeOut: 5000,
            positionClass: 'toast-top-center'
          });
        }
      );

    this.router.routeReuseStrategy.shouldReuseRoute = () => false;

    this.deletingResource = false;
  }
  users;
  loadingUsers;
  loadUsers(){
    console.log("USER VIEWER")
    this.loadingUsers=true;
    this.studyService.getStudyUserStats(this.study._id).subscribe(
      response => {
        this.users = response.responseArray;
        this.users.forEach(element => {
          if(element.lastSession){
            element.lastSession = new Date(element.lastSession).toLocaleString('es-CL');
          }
        });
        this.loadingUsers=false;
        console.log(response, 'response')
      },
      err => {
        console.log("ERROR EN LA CARGA")
        this.loadingUsers=false;

      }
    );

    console.log(this.users)

  }

  @ViewChild(MatSort) sort: MatSort;
  ngAfterViewInit() {
    if(this.users != 'undefined' && this.users != null)
      this.users.sort = this.sort;
  }
  columnsToDisplay = ['username', 'challenges', 'lastSession', 'answers'];
  columnsToDisplayCollaborators = ['icon','fullname', 'email', 'invitation','actions'];
  columnsToDisplayCollaboratorsNotOwner = ['icon','fullname', 'email','invitation'];
  columnsToDisplayCloneHistory = ['fullname', 'email', 'date','hour'];

  ///

  findDummy(){
    this.authService.findDummy(this.study._id).subscribe(
      response => {
        this.dummyExists = response['user'];
      }
    )
  }

  createDummy(){
    this.authService.signupDummy(this.study._id).subscribe(
      user => {
        this.toastr.success(this.translate.instant("STUDY.TOAST.DUMMY_SUCCESS"), this.translate.instant("STUDY.TOAST.SUCCESS"), {
          timeOut: 5000,
          positionClass: 'toast-top-center'
        });
        this.ngOnInit();
      },
      err => {
        this.toastr.error(this.translate.instant("STUDY.TOAST.DUMMY_ERROR"), this.translate.instant("STUDY.TOAST.ERROR"), {
          timeOut: 5000,
          positionClass: 'toast-top-center'
        });
      }
    )
  }

  renewDummy(){
    this.authService.renewDummy(this.study._id).subscribe(
      user => {
        this.toastr.success(this.translate.instant("STUDY.TOAST.DUMMY_RESET_SUCCESS"), this.translate.instant("STUDY.TOAST.SUCCESS"), {
          timeOut: 5000,
          positionClass: 'toast-top-center'
        });
        this.dummyExists = true;
      },
      err => {
        this.toastr.error(this.translate.instant("STUDY.TOAST.DUMMY_RESET_ERROR"), this.translate.instant("STUDY.TOAST.ERROR"), {
          timeOut: 5000,
          positionClass: 'toast-top-center'
        });
      }
    )
  }

  confirmStudyDelete(id: string){
    confirm(this.translate.instant("ADMIN.STUDIES.DELETE_CONFIRMATION")) && this.deleteStudy(id);
  }
  confirmCollaborationLeft(){
    confirm('Seguro que desea dejar de ser colaborador del estudio: '+this.study.name) && this.collaborationLeft();
  }
  collaborationLeft(){
    let collaborators = this.study.collaborators.slice();
    let index = collaborators.findIndex(coll => coll.user._id === this.user._id)
    collaborators.splice(index,1);
    console.log(collaborators)
    this.editCollaborator(collaborators,"Ha dejado de ser colaborador del estudio: "+this.study.name,"No se ha podido realizar la operación, intente más tarde");
    this.router.navigate(['/admin_panel']);

  }
  staticsLeft(studyId: string){
    this.router.navigate([`/admin_panel/study/${studyId}/statics`]);
  }
  deleteStudy(id: string){
    this.studyService.deleteStudy(id)
      .subscribe(study => {
        this.toastr.success(this.translate.instant("STUDY.TOAST.SUCCESS_MESSAGE_DELETE"), this.translate.instant("STUDY.TOAST.SUCCESS"), {
          timeOut: 5000,
          positionClass: 'toast-top-center'
        });
        this.router.navigate(['admin_panel']);
      },
      err => {
        this.toastr.error(this.translate.instant("STUDY.TOAST.ERROR_MESSAGE_DELETE"), this.translate.instant("STUDY.TOAST.ERROR"), {
          timeOut: 5000,
          positionClass: 'toast-top-center'
        });
      }
    );
  }
  getAllChallengeResources(){
    this.challenges.forEach(challenge =>{
      challenge.resources = this.getChallengeResources(challenge._id);
    })
  }
  getChallengeResources(challengeId: string){
    var finalResources = [];
    var filterByChallengeResources = this.filteredResources.filter(resource => resource.task[0] === challengeId);
    filterByChallengeResources.forEach(resource => finalResources.push(resource));
    return finalResources;
  }
  confirmAddCollaborator(){
    confirm('¿Seguro que desea agregar al colaborador?') && this.verifyCollaborator();
  }
  confirmRemoveCollaborator(collaborator){
    confirm('¿Seguro que desea eliminar al colaborador?') && this.deleteCollaborator(collaborator);
  }
  deleteCollaborator(collaborator){
    var newCollaboratorList = this.study.collaborators.filter(
                              coll => coll.user.email !== collaborator.user.email);
    this.editCollaborator(newCollaboratorList,"Se ha eliminado correctamente el colaborador al estudio","El colaborador no ha podido ser eliminado");
  }
  addCollaborator(user: User){
    let newCollaboratorList = this.study.collaborators.slice();
    newCollaboratorList.push({user: user, invitation: 'Pendiente'});
    this.editCollaborator(newCollaboratorList,"Se ha añadido correctamente el colaborador al estudio","El colaborador no ha podido ser añadido");
    this.emailFormControl.setValue('');
  }

  @ViewChild(MatTable) table: MatTable<Collaborators>;
  editCollaborator(collaboratorList, msg1, msg2){
    this.studyService.editCollaboratorStudy(this.study._id, collaboratorList).subscribe(
      response => {
        this.toastr.success(msg1, "Éxito",{
          timeOut: 5000,
          positionClass: 'toast-top-center'
        });
        this.study.collaborators = response.study.collaborators;

        this.emailFormControl.setValidators([Validators.email,notThisUser(this.user),notExistingColl(this.study.collaborators)]);
        this.emailFormControl.updateValueAndValidity();
        
        if(this.study.collaborators.length > 0){
          this.collaboratorsExist = true;
          this.table.renderRows();
        }
        else
          this.collaboratorsExist = false;
        
      },
      err => {
        this.toastr.error(msg2, "Error",{
          timeOut: 5000,
          positionClass: 'toast-top-center'
        });
      }
    );

  }
  verifyCollaborator(){
    if(this.emailFormControl.value === '' || this.emailFormControl.status === 'INVALID'){
      return
    }
    let collaborator: User;
    this.authService.getUserbyEmail(this.emailFormControl.value).subscribe(
      response => {
        collaborator = response['user']
        this.addCollaborator(collaborator);

      },
      (error) => {
          if(error === 'EMAIL_NOT_FOUND'){
            this.toastr.error("No se encuentra el correo ingresado", "Usuario Inexistente", {
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
  refreshResources(){
    this.endpointsService.getDocuments('*', this.route.snapshot.paramMap.get('study_id'))
      .subscribe((response: Resource[]) => {
        this.resources = response;
        this.filteredResources = [];
        this.filteredResources = this.resources.filter(resource => resource.type != 'image');
      })
  }

  confirmChallengeDelete(id: string){
    confirm(this.translate.instant("ADMIN.CHALLENGES.DELETE_CONFIRMATION")) && this.deleteChallenge(id);
  }

  deleteChallenge(id: string){
    this.challengeService.deleteChallenge(id)
      .subscribe(challenge => {
        this.challengeService.getChallengesByStudy(this.route.snapshot.paramMap.get('study_id'))
          .subscribe(response => this.challenges = response['challenges']);
        this.toastr.success(this.translate.instant("CHALLENGE.TOAST.SUCCESS_MESSAGE_DELETE"), this.translate.instant("CHALLENGE.TOAST.SUCCESS"), {
          timeOut: 5000,
          positionClass: 'toast-top-center'
        });
      },
      err => {
        this.toastr.error(this.translate.instant("CHALLENGE.TOAST.ERROR_MESSAGE_DELETE"), this.translate.instant("CHALLENGE.TOAST.ERROR"), {
          timeOut: 5000,
          positionClass: 'toast-top-center'
        });
      }
    );
  }

  confirmResourceDelete(resource: Resource){
    confirm(this.translate.instant("ADMIN.CHALLENGES.RESOURCE_DELETE_CONFIRMATION")) && this.deleteResource(resource);
  }

  deleteResource(resource: Resource){
    this.deletingResource = true;
    this.endpointsService.deleteDocument(resource)
      .subscribe(response => {
        this.endpointsService.getDocuments('*', this.route.snapshot.paramMap.get('study_id'))
        .subscribe((response: Resource[]) => {
          this.resources = response;
          this.filteredResources = [];
          this.filteredResources = this.resources.filter(resource => resource.type != 'image');
        })
        this.toastr.success(this.translate.instant("UPLOAD.TOAST.SUCCESS_MESSAGE_DELETE"), this.translate.instant("UPLOAD.TOAST.SUCCESS"), {
          timeOut: 5000,
          positionClass: 'toast-top-center'
        });
        this.deletingResource = false;
      },
      err => {
        this.toastr.error(this.translate.instant("UPLOAD.TOAST.ERROR_MESSAGE_DELETE"), this.translate.instant("UPLOAD.TOAST.ERROR"), {
          timeOut: 5000,
          positionClass: 'toast-top-center'
        });
      }
    );
  }

  updateChallenge(id: string, updatedChallenge: string){
    this.challengeService.putChallenge(id, updatedChallenge)
    .subscribe(challenge => {
      this.challengeService.getChallengesByStudy(this.route.snapshot.paramMap.get('study_id'))
        .subscribe(response => this.challenges = response['challenges']);
        this.toastr.success(this.translate.instant("CHALLENGE.TOAST.SUCCESS_MESSAGE_UPDATE") + challenge['challenge'].question, this.translate.instant("CHALLENGE.TOAST.SUCCESS"), {
          timeOut: 5000,
          positionClass: 'toast-top-center'
        });
      },
      err => {
        this.toastr.error(this.translate.instant("CHALLENGE.TOAST.ERROR_MESSAGE_UPDATE"), this.translate.instant("CHALLENGE.TOAST.ERROR"), {
          timeOut: 5000,
          positionClass: 'toast-top-center'
        });
      }
    );
  }

  showStudyUpdateDialog(): void {
    const timeout = this.edit_minutes*60*1000;
    this.studyService.getStudy(this.route.snapshot.paramMap.get('study_id')).subscribe(
      response => {
        const dialogRef = this.matDialog.open(StudyUpdateComponent, {
          width: '60%',
          data: {study: response.study, userOwner: this.userOwner},
        })

        dialogRef.afterOpened().subscribe(() => {
          setTimeout(() => {
            if(!(dialogRef.getState() === MatDialogState.CLOSED)){
              this.toastr.info('Se ha acabado su tiempo de edición', 'Información', {
                timeOut: 5000,
                positionClass: 'toast-top-center'
              });
              dialogRef.close();
            }
            
         }, timeout)
        })

        dialogRef.afterClosed().subscribe(() => {
          this.ngOnInit()
        });
      },
      err => {
        console.log(err)
      }
    );
    
  }

  showChallengeUpdateDialog(challenge: Challenge): void {
    const timeout = this.edit_minutes*60*1000;
    this.challengeService.getChallenge(challenge._id).subscribe(
      response => {
        const dialogRef = this.matDialog.open(ChallengeUpdateComponent, {
          width: '60%',
          data: response.challenge
        });

        dialogRef.afterClosed().subscribe(() => this.ngOnInit());

        dialogRef.afterOpened().subscribe(() => {
          setTimeout(() => {
            if(!(dialogRef.getState() === MatDialogState.CLOSED)){
              this.toastr.info('Se ha acabado su tiempo de edición', 'Información', {
                timeOut: 5000,
                positionClass: 'toast-top-center'
              });
              dialogRef.close();
            }
            
         }, timeout)
        })
      },
      err => {
        console.log(err);
      }
    )
    
  }

  getClass(type){
    if (type=="page"){
      return "webPage";
    }
    else if(type=="video"){
      return "video"
    }
    else if(type=="image"){
      return "image"
    }else{
      return "document"
    }
  }
  getClassQuestion(type){
    if (type=="page"){
      return "CHALLENGE.QUESTION_TYPE.PAGE";
    }
    else if(type=="video"){
      return "CHALLENGE.QUESTION_TYPE.VIDEO"
    }
    else if(type=="image"){
      return "CHALLENGE.QUESTION_TYPE.IMAGE"
    }else{
      return "CHALLENGE.QUESTION_TYPE.DOCUMENT"
    }
  }
  formatDate(date){
    return date.substr(0,10);
  }
  requestEdit(){
    this.studyService.requestForEdit(this.study._id,{user:this.user._id}).subscribe(
      response => {
        console.log(response);
      },
      err => {
        console.log(err);
      }
    )
  }
  reloadChallenges(){
    this.challengeService.getChallengesByStudy(this.route.snapshot.paramMap.get('study_id'))
      .subscribe(response => {
        this.challenges = response['challenges'];
      });
    this.endpointsService.getDocuments('*', this.route.snapshot.paramMap.get('study_id'))
    .subscribe((response: Resource[]) => {
      this.resources = response;
    });
  }
  confirmCloneStudy(){
    confirm("¿Seguro/a que desea clonar este estudio?") && this.cloneStudy();
  }
  cloneStudy(){
    this.loadingClone = true;
    let user_id = this.user._id
    this.studyService.copyStudy(this.study._id,user_id).subscribe(
      response => {
        console.log(response)
        this.authService.signupDummy(response['copy']._id).subscribe(
          user => {
            console.log('Se creó el usuario de prueba',user)
          },
          err => {
            console.log('Error al crear el usuario de prueba',err)

          }
        )
        this.loadingClone = false;
        let link = '/admin_panel/study/'+response.copy._id ;
        this.toastr.success("El estudio ha sido clonado exitosamente, los recursos pueden tardar unos minutos en cargarse","Éxito",{
          timeOut: 5000,
          positionClass: 'toast-top-center'
        });
        this.router.navigate([link]);
        this.loadingClone = false;
      },
      err => {
        this.toastr.error("El estudio seleccionado no ha podido ser clonado", "Error en la clonación", {
          timeOut: 5000,
          positionClass: 'toast-top-center'
        });
        this.loadingClone = false;
      }
    );
  }

}
