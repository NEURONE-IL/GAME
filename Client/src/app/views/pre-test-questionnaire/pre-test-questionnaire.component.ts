import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
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
  requiredType: string = 'pre-test';
  isLoggedIn = false;
  user: any;
  question: string;

  constructor(private formBuilder: FormBuilder,
              private questionnaireService: QuestionnaireService,
              private authService: AuthService,
              private toastr: ToastrService,
              private translate: TranslateService,
              public gameService: GameService,
              public router: Router,
              private changeDetector: ChangeDetectorRef
              ) { }

  ngOnInit(): void {

    this.question = this.gameService.challenge.question;
    this.questionnaireForm = this.formBuilder.group({
      answers: new FormArray([])
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
    /*Dispatch pretestquestionnaireenter event*/
    var evt = new CustomEvent('pretestquestionnaireenter');
    window.dispatchEvent(evt);
    /*End dispatch pretestquestionnaireenter event*/
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

  saveAnswers(){
    this.questionnaireService.postAnswers(this.user, this.questionnaires, this.questionnaireForm.value.answers, this.gameService.challenge, this.requiredType)
    .subscribe(async response => {
      this.toastr.success(this.translate.instant("QUESTIONNAIRE.PRE_TEST.TOAST.SUCCESS_MESSAGE"), this.translate.instant("QUESTIONNAIRE.PRE_TEST.TOAST.SUCCESS"), {
          timeOut: 5000,
          positionClass: 'toast-top-center'
        });
        this.resetForm();
        await this.gameService.finishPreTest();
        this.gameService.challengeStarted();
      },
      err => {
        this.toastr.error(this.translate.instant("QUESTIONNAIRE.PRE_TEST.TOAST.ERROR_MESSAGE"), this.translate.instant("QUESTIONNAIRE.PRE_TEST.TOAST.ERROR"), {
          timeOut: 5000,
          positionClass: 'toast-top-center'
        });
      }
    );
  }

  ngOnDestroy(){
    /*Dispatch pretestquestionnaireexit event*/
    var evt = new CustomEvent('pretestquestionnaireexit');
    window.dispatchEvent(evt);
    /*End dispatch pretestquestionnaireexit event*/    
  }  
}