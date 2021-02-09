import { ChangeDetectorRef, EventEmitter, Output } from '@angular/core';
import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth/auth.service';
import { GameService } from 'src/app/services/game/game.service';
import { Questionnaire, QuestionnaireService } from 'src/app/services/game/questionnaire.service';

@Component({
  selector: 'app-initial-questionnaire',
  templateUrl: './initial-questionnaire.component.html',
  styleUrls: ['./initial-questionnaire.component.css']
})
export class InitialQuestionnaireComponent implements OnInit {

  constructor(private formBuilder: FormBuilder,
              private questionnaireService: QuestionnaireService,
              private gameService: GameService,
              private authService: AuthService,
              public router: Router,
              private toastr: ToastrService,
              private translate: TranslateService,
              private changeDetector: ChangeDetectorRef              
              ) { }

  questionnaireForm: FormGroup;
  questionnaires: Questionnaire[];
  requiredType: string = 'initial';
  @Output() onSaveClick = new EventEmitter();


  ngOnInit(): void {

    this.questionnaireForm = this.formBuilder.group({
      answers: new FormArray([])
    })

    this.questionnaireService.getQuestionnairesByType(this.requiredType)
    .subscribe(response => {
      this.questionnaires = response['questionnaires'];
      this.questionnaires.forEach(questionnaire => {
        for(var i=0; i<questionnaire.questions.length; i++){
          this.addAnswer();
        }
      });
      this.resetForm();
    });
  }

  ngAfterContentChecked() {
    this.changeDetector.detectChanges();
  } 

  get questionnaireFormControls(): any {
    return this.questionnaireForm['controls'];
  }

  addAnswer(): void {
    const answers = this.questionnaireForm.get('answers') as FormArray;
    answers.push(new FormControl(['', Validators.required]));
  }  

  resetForm() {
    this.questionnaireForm.reset();
  }

  save() {
    this.onSaveClick.emit();
    console.log(this.questionnaireForm);
    console.log(this.questionnaires[0]);
    this.questionnaireService.postAnswers(this.authService.getUser(), this.questionnaires[0], this.questionnaireForm.value)
    .subscribe(response => {
        this.toastr.success(this.translate.instant("QUESTIONNAIRE.POST_TEST.TOAST.SUCCESS_MESSAGE"), this.translate.instant("QUESTIONNAIRE.POST_TEST.TOAST.SUCCESS"), {
          timeOut: 5000,
          positionClass: 'toast-top-center'
        });
        this.resetForm();
        this.authService.updateProgress({'initial_questionnaire': true});
        this.gameService.stage = 'pre-test';
      },
      err => {
        this.toastr.error(this.translate.instant("QUESTIONNAIRE.POST_TEST.TOAST.ERROR_MESSAGE"), this.translate.instant("QUESTIONNAIRE.POST_TEST.TOAST.ERROR"), {
          timeOut: 5000,
          positionClass: 'toast-top-center'
        });
      }
    );
  }

}
