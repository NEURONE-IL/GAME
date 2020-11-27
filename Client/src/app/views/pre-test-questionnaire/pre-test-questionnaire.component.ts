import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Questionnaire, QuestionnaireService } from '../../services/game/questionnaire.service';

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
  @Output() onSaveClick = new EventEmitter();

  constructor(private formBuilder: FormBuilder, private questionnaireService: QuestionnaireService) { }

  ngOnInit(): void {

    this.questionnaireForm = this.formBuilder.group({
      answers: new FormArray([]),
      checked: ['', Validators.required]
    })

    this.questionnaireService.getQuestionnairesByType(this.requiredType)
    .subscribe(response => {
      this.questionnaires = response['questionnaires'];
      this.questionnaires.forEach(questionnaire => {
        for(var i=0; i<questionnaire.questions.length; i++){
          this.addAnswer();
        }
      })
    });
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

  test() {
    this.onSaveClick.emit();
    console.log(this.questionnaireForm.value);
  }
}
