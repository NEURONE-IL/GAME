import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Questionnaire, QuestionnaireService } from '../../services/game/questionnaire.service';
import { AuthService } from '../../services/auth/auth.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { GameService } from 'src/app/services/game/game.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pre-test-questionnaire',
  templateUrl: './pre-test-questionnaire.component.html',
  styleUrls: ['./pre-test-questionnaire.component.css']
})
export class PreTestQuestionnaireComponent implements OnInit {
  questionnaireForm: FormGroup;
  values: number[] = [1, 2, 3, 4, 5, 6];
  questionnaires: Questionnaire[];
  requiredType: string = 'pre';
  isLoggedIn = false;
  user: any;
  question: string;

  constructor(private formBuilder: FormBuilder,
              private questionnaireService: QuestionnaireService,
              private authService: AuthService,
              private toastr: ToastrService,
              private translate: TranslateService,
              private gameService: GameService,
              public router: Router) { }

  ngOnInit(): void {

    this.question = this.gameService.challenge.question;
    this.questionnaireForm = this.formBuilder.group({
      answers: new FormArray([]),
      checked: ['', Validators.required]
    })
    console.log(this.question);

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

    this.isLoggedIn = this.authService.loggedIn;
    this.user = this.authService.getUser();
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

  saveAnswers(){
    this.questionnaireService.postAnswers(this.user, this.questionnaires[0], this.questionnaireForm.value.answers)
    .subscribe(async response => {
      this.toastr.success(this.translate.instant("QUESTIONNAIRE.PRE_TEST.TOAST.SUCCESS_MESSAGE"), this.translate.instant("QUESTIONNAIRE.PRE_TEST.TOAST.SUCCESS"), {
          timeOut: 5000,
          positionClass: 'toast-top-center'
        });
        this.resetForm();
        await this.gameService.finishPreTest();
        this.gameService.stage = 'instructions';
      },
      err => {
        this.toastr.error(this.translate.instant("QUESTIONNAIRE.PRE_TEST.TOAST.ERROR_MESSAGE"), this.translate.instant("QUESTIONNAIRE.PRE_TEST.TOAST.ERROR"), {
          timeOut: 5000,
          positionClass: 'toast-top-center'
        });
      }
    );
  }
}
