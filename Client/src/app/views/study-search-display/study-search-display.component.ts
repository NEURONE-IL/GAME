import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Challenge, ChallengeService } from '../../services/game/challenge.service';
import { Study, StudyService, Collaborators } from '../../services/game/study.service';
import { EndpointsService, Resource} from '../../services/endpoints/endpoints.service';
import { environment } from 'src/environments/environment';
import { MatDialog } from '@angular/material/dialog';
import { User, AuthService } from 'src/app/services/auth/auth.service';
import { InvitationService, Invitation } from 'src/app/services/admin/invitation.service';
import { MatSort } from "@angular/material/sort";
import { I } from '@angular/cdk/keycodes';

@Component({
  selector: 'app-study-search-display',
  templateUrl: './study-search-display.component.html',
  styleUrls: ['./study-search-display.component.css']
})
export class StudySearchDisplayComponent implements OnInit {
  
  constructor(private router: Router,
              private route: ActivatedRoute,
              private challengeService: ChallengeService,
              private studyService: StudyService,
              private authService: AuthService,
              private toastr: ToastrService,
              private translate: TranslateService,
              public endpointsService: EndpointsService,
              public matDialog: MatDialog,
              private invitationService: InvitationService
              ) { }

  study: Study;
  user: User;
  challenges: Challenge[] = [];
  resources: Resource[] = [];
  filteredResources: Resource[] = [];
  createChallenge: boolean;
  verDocumentos: boolean;
  dummyExists: boolean = false;
  collaboratorsExist: boolean = false;
  searchView: boolean;
  registerLink: string;
  deletingResource: boolean;
  loadingClone: boolean = false;
  notActualCollaborator: boolean = true;
  collabSended: boolean = false;
  filterCollaborators: Collaborators[];
  existingInvitation: boolean = false;

 
  ngOnInit(): void {
    this.createChallenge = false;
    this.verDocumentos = false;
    this.searchView = false;
    this.user = this.authService.getUser();

    this.studyService.getStudy(this.route.snapshot.paramMap.get('study_id')).subscribe(
      response => {
        this.study = response['study'];
        this.registerLink = environment.frontURL + 'welcome/' + this.study._id;
        if (this.study.collaborators.length>0){
          this.collaboratorsExist = true
          this.filterCollaborators = this.study.collaborators.filter(coll => coll.invitation === 'Aceptada')
          this.notActualCollaborator = !this.filterCollaborators.some(coll => coll.user._id === this.user._id)
        }
        else{
          this.collaboratorsExist = false;
          this.notActualCollaborator = true;
        }
        this.checkCollabInvitation();
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
      })

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
  columnsToDisplayCollaborators = ['icon','fullname', 'email'];



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

  getChallengeResources(challengeId: string){
    var finalResources = [];
    var filteredResources = this.resources.filter(resource => resource.task[0] === challengeId && resource.type != 'image');
    filteredResources.forEach(resource => finalResources.push(resource));
    return finalResources;
  }

  refreshResources(){
    this.endpointsService.getDocuments('*', this.route.snapshot.paramMap.get('study_id'))
      .subscribe((response: Resource[]) => {
        this.resources = response;
        this.filteredResources = [];
        this.filteredResources = this.resources.filter(resource => resource.type != 'image');
      })
  }

  confirmCollaborateRequest(): void {
    confirm("¿Seguro/a que desea solicitar colaborar en este estudio?") && this.requestCollaboration();
  }
  checkCollabInvitation(){
    this.invitationService.checkExistingInvitation(this.user._id, this.study._id).subscribe(
      response => {
        if(response.message === "NOT_EXISTING_INVITATION")
          this.existingInvitation = false;
        else
          this.existingInvitation = true;
      },
      err => {
        console.log(err)
      }
    );
  }
  requestCollaboration(){
    let invitation = {
      user: this.user,
      study: this.study,
    }
    this.invitationService.requestCollab(invitation).subscribe(
      response => {
        console.log(response)
        this.checkCollabInvitation();
        this.toastr.success("Se ha enviado correctamente la solicitud de colaboración, se le notificará la respuesta","Éxito",{
          timeOut: 5000,
          positionClass: 'toast-top-center'
        });
      },
      err =>{
        console.log(err)
        this.toastr.error("No se ha podido enviar la solicitud de colaboración, intente más tarde","Error",{
          timeOut: 5000,
          positionClass: 'toast-top-center'
        });

      }
    );
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
  reloadChallenges(){
    this.challengeService.getChallengesByStudy(this.route.snapshot.paramMap.get('study_id'))
      .subscribe(response => {
        this.challenges = response['challenges'];
      });
    this.endpointsService.getDocuments('*', this.route.snapshot.paramMap.get('study_id'))
    .subscribe((response: Resource[]) => {
      this.resources = response;
      console.log(this.resources);
    });
  }
}
