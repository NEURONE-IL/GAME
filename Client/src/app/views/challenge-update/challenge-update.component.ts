import { Component, Inject, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Challenge, ChallengeService } from '../../services/game/challenge.service';
import { Study, StudyService } from '../../services/game/study.service';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-challenge-update',
  templateUrl: 'challenge-update.component.html',
  styleUrls: ['./challenge-update.component.css']
})
export class ChallengeUpdateComponent implements OnInit{
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

  constructor(@Inject(MAT_DIALOG_DATA)
    public challenge: Challenge,
    private formBuilder: FormBuilder,
    private router: Router,
    private challengeService: ChallengeService,
    private studyService: StudyService,
    private toastr: ToastrService,
    private translate: TranslateService,
    public matDialog: MatDialog) { }

  ngOnInit(): void {

    this.challengeForm = this.formBuilder.group({
      question: [this.challenge.question, [Validators.required, Validators.minLength(10), Validators.maxLength(300)]],
      question_type: [this.challenge.question_type, Validators.required],
      seconds: [this.challenge.seconds, [Validators.required, Validators.maxLength(3), Validators.min(30)]],
      max_attempts: [this.challenge.max_attempts, [Validators.required, Validators.maxLength(2), Validators.min(1)]],
      hint: [this.challenge.hint, [Validators.minLength(5), Validators.maxLength(100)]],
      answer_type: [this.challenge.answer_type, [Validators.minLength(3), Validators.maxLength(50)]],
      answer: [this.challenge.answer, [Validators.required, Validators.minLength(1), Validators.maxLength(300)]],
    });

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

  get challengeFormControls(): any {
    return this.challengeForm['controls'];
  }

  updateChallenge(challengeId: string){
    this.loading = true;
    let challenge = this.challengeForm.value;
    challenge.study = this.challenge.study;
    console.log(challenge);
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
}
