import {Component, OnInit, ViewChild} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Challenge, ChallengeService } from '../../services/game/challenge.service';
import { Study, StudyService } from '../../services/game/study.service';
import { EndpointsService, Resource} from '../../services/endpoints/endpoints.service';
import { environment } from 'src/environments/environment';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth/auth.service';
import { MatSort } from "@angular/material/sort";
import { StudyUpdateComponent } from '../study-update/study-update.component';
import { ChallengeUpdateComponent } from '../challenge-update/challenge-update.component';

@Component({
  selector: 'app-study-display',
  templateUrl: './study-display.component.html',
  styleUrls: ['./study-display.component.css']
})
export class StudyDisplayComponent implements OnInit {
  study: Study;
  challenges: Challenge[] = [];
  resources: Resource[] = [];
  filteredResources: Resource[] = [];
  createChallenge: boolean;
  verDocumentos: boolean;
  dummyExists: boolean = false;
  searchView: boolean;
  registerLink: string;
  deletingResource: boolean;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private challengeService: ChallengeService,
              private studyService: StudyService,
              private authService: AuthService,
              private toastr: ToastrService,
              private translate: TranslateService,
              public endpointsService: EndpointsService,
              public matDialog: MatDialog
              ) { }

  ngOnInit(): void {
    this.createChallenge = false;
    this.verDocumentos = false;
    this.searchView = false;

    this.studyService.getStudy(this.route.snapshot.paramMap.get('study_id')).subscribe(
      response => {
        this.study = response['study'];
        this.registerLink = environment.frontURL + 'welcome/' + this.study._id;
        console.log(this.route.snapshot.paramMap.get('study_id'))
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
        console.log(this.resources);
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
    this.users.sort = this.sort;
  }
  columnsToDisplay = ['username', 'challenges', 'lastSession', 'answers'];




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
    const dialogRef = this.matDialog.open(StudyUpdateComponent, {
      width: '60%',
      data: this.study
    }).afterClosed()
    .subscribe(() => this.ngOnInit());
  }

  showChallengeUpdateDialog(challenge: Challenge): void {
    const dialogRef = this.matDialog.open(ChallengeUpdateComponent, {
      width: '60%',
      data: challenge
    }).afterClosed()
    .subscribe(() => this.ngOnInit());
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
