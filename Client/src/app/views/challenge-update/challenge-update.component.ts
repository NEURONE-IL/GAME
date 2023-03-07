import { Component, Inject, Input, OnInit,OnDestroy, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Challenge, ChallengeService } from '../../services/game/challenge.service';
import { Study, StudyService } from '../../services/game/study.service';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService, User } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-challenge-update',
  templateUrl: 'challenge-update.component.html',
  styleUrls: ['./challenge-update.component.css']
})
export class ChallengeUpdateComponent implements OnInit,OnDestroy{
  @Input() study: string;
  challengeForm: FormGroup;
  studies: Study[];
  questionOptions = [
    { id: 1, value: 'page', show: "CHALLENGE.FORM.SELECTS.QUESTION_TYPE.WEB_PAGE" },
    { id: 2, value: 'image', show: "CHALLENGE.FORM.SELECTS.QUESTION_TYPE.IMAGE" },
    { id: 3, value: 'book', show: "CHALLENGE.FORM.SELECTS.QUESTION_TYPE.BOOK" },
    { id: 4, value: 'video', show: "CHALLENGE.FORM.SELECTS.QUESTION_TYPE.VIDEO" }
  ];
  answerOptions = [
    { id: 1, value: 'string', show: "CHALLENGE.FORM.SELECTS.ANSWER_TYPE.STRING" },
    { id: 2, value: 'number', show: "CHALLENGE.FORM.SELECTS.ANSWER_TYPE.NUMBER" },
    { id: 3, value: 'url', show: "CHALLENGE.FORM.SELECTS.ANSWER_TYPE.URL" },
    { id: 4, value: 'justify', show: "CHALLENGE.FORM.SELECTS.ANSWER_TYPE.JUSTIFY" }
  ];
  loading: Boolean;
  user: User;
  edit_users : String[] = [];
  edit_minutes: number = 3;
  timer_id: NodeJS.Timeout;
  timer: string = '3:00';
  timer_color: string = 'primary';

  constructor(@Inject(MAT_DIALOG_DATA)
    public challenge: Challenge,
    private formBuilder: FormBuilder,
    private router: Router,
    private challengeService: ChallengeService,
    private studyService: StudyService,
    private authService: AuthService,
    private toastr: ToastrService,
    private translate: TranslateService,
    public matDialog: MatDialog) { }

  ngOnInit(): void {

    this.challengeService.closeEventSource();
    this.user = this.authService.getUser();
    this.challengeForm = this.formBuilder.group({
      question: [this.challenge.question, [Validators.required, Validators.minLength(10), Validators.maxLength(300)]],
      question_type: [this.challenge.question_type, Validators.required],
      seconds: [this.challenge.seconds, [Validators.required, Validators.maxLength(3), Validators.min(30)]],
      max_attempts: [this.challenge.max_attempts, [Validators.required, Validators.maxLength(2), Validators.min(1)]],
      hint: [this.challenge.hint, [Validators.minLength(5), Validators.maxLength(100)]],
      answer_type: [this.challenge.answer_type, [Validators.minLength(3), Validators.maxLength(50)]],
      answer: [this.challenge.answer, [Validators.required, Validators.minLength(1), Validators.maxLength(300)]],
    });

    this.requestEdit();
    
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

    this.loading = false;
  }
  ngOnDestroy(): void{
    clearInterval(this.timer_id);
    this.releaseChallenge();
    this.challengeService.closeEventSource();
  }
  @HostListener('window:beforeunload', ['$event'])
  doSomething($event){
    this.ngOnDestroy();
  }

  countdown(){
    let time: number = this.edit_minutes * 60 - 1;
    //let time: number = 10;
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

  get challengeFormControls(): any {
    return this.challengeForm['controls'];
  }

  updateChallenge(challengeId: string){
    this.loading = true;
    let challenge = this.challengeForm.value;
    challenge.study = this.challenge.study;
    challenge.user_edit = this.authService.getUser()._id;
    this.challengeService.putChallenge(challengeId, challenge).subscribe(
      challenge => {
        this.toastr.success(this.translate.instant("CHALLENGE.TOAST.SUCCESS_MESSAGE_UPDATE") + ': ' + challenge['challenge'].question, this.translate.instant("CHALLENGE.TOAST.SUCCESS"), {
          timeOut: 5000,
          positionClass: 'toast-top-center'
        });
        this.loading = false;
        this.matDialog.closeAll();
      },
      err => {
        this.toastr.error(this.translate.instant("CHALLENGE.TOAST.ERROR_MESSAGE_UPDATE"), this.translate.instant("CHALLENGE.TOAST.ERROR"), {
          timeOut: 5000,
          positionClass: 'toast-top-center'
        });
      }
    );
  }
  requestEdit(){
    let user_id = this.authService.getUser()._id;
    this.challengeService.requestForEdit(this.challenge._id,{user:user_id}).subscribe(
      response => {
        this.edit_users = response.users;
        this.updateStatusForm(1)
        if(this.edit_users[0] != user_id){
          this.challengeService.getServerSentEvent(this.challenge._id, user_id).subscribe(
            response => {
              let data = JSON.parse(response.data);
              this.edit_users = data.currentUsers;
              console.log('edit_users: ',this.edit_users);
              if(this.edit_users[0] === user_id){
                this.updateStatusForm(0);
                this.challengeService.closeEventSource();
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
  releaseChallenge(){
    let user_id = this.authService.getUser()._id;
    this.challengeService.releaseForEdit(this.challenge._id, {user:user_id}).subscribe(
      challenge => {
        console.log('Challenge Release');
        this.matDialog.closeAll();
      },
      err => {
        console.log(err)
      }
    );
  }
  getChallenge(){
    this.challengeService.getChallenge(this.challenge._id).subscribe(
      response => {
        console.log(response.challenge);
        this.challenge = response.challenge;
        this.updateChallengeField();
    }, 
    err => {
      console.log(err)
    })
  }
  updateStatusForm(state: number){
    let user_id = this.authService.getUser()._id;
    if(!(this.edit_users[0] === user_id)){
      console.log('No puede editar');
      this.challengeForm.disable();
      this.toastr.warning('El desafío está siendo editado por alguien más, una vez que el usuario termine, podrá editarlo', 'Advertencia', {
        timeOut: 5000,
        positionClass: 'toast-top-center'
      });
    }
    else if(this.edit_users[0] === user_id){
      console.log('Puede editar!')
      this.countdown();
      this.challengeForm.enable();
      
      if(state != 1){
        this.getChallenge();
        this.toastr.info('El desafío puede ser editado ahora', 'Información', {
          timeOut: 5000,
          positionClass: 'toast-top-center'
        });
      }
    }
  }
  updateChallengeField(){
    this.challengeForm.controls['question'].setValue(this.challenge.question);
    this.challengeForm.controls['question_type'].setValue(this.challenge.question_type);
    this.challengeForm.controls['seconds'].setValue(this.challenge.seconds);
    this.challengeForm.controls['max_attempts'].setValue(this.challenge.max_attempts);
    this.challengeForm.controls['hint'].setValue(this.challenge.hint);
    this.challengeForm.controls['answer_type'].setValue(this.challenge.answer_type);
    this.challengeForm.controls['answer'].setValue(this.challenge.answer);
    
  }
}
