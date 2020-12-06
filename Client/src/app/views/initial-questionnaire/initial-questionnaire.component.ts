import { EventEmitter, Output } from '@angular/core';
import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
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
              public router: Router) { }

  questionnaireForm: FormGroup;
  questionnaires: Questionnaire[];
  requiredType: string = 'initial';
  @Output() onSaveClick = new EventEmitter();


  ngOnInit(): void {

    this.questionnaireForm = this.formBuilder.group({
      marked: new FormArray([]),
      checked: ['', Validators.required]
    })

    this.questionnaireService.getQuestionnairesByType(this.requiredType)
    .subscribe(response => {
      this.questionnaires = response['questionnaires'];
      let index=0;
      this.questionnaires.forEach(questionnaire => {
        questionnaire.questions.forEach(question => {
          question.options.forEach(option => {
            option.index=index;
            this.markedFormArray.push(new FormControl(false));
            index++;
          });
        });
      });
    });
  }

  get questionnaireFormControls(): any {
    return this.questionnaireForm['controls'];
  }

  get markedFormArray() {
    return this.questionnaireForm.controls.marked as FormArray;
  }

  resetForm() {
    this.questionnaireForm.reset();
  }

  save() {
    this.onSaveClick.emit();
    this.router.navigate(['start/pre-test']);
  }

}
