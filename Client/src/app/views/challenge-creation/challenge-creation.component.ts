import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-challenge-creation',
  templateUrl: './challenge-creation.component.html',
  styleUrls: ['./challenge-creation.component.css']
})
export class ChallengeCreationComponent implements OnInit {
  challengeForm: FormGroup;
  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {

    this.challengeForm = this.formBuilder.group({
      question: ['', [Validators.required, Validators.minLength(20), Validators.maxLength(200)]],
      seconds: ['', [Validators.required, Validators.maxLength(3), Validators.min(30)]],
      domain: ['', [Validators.minLength(3), Validators.maxLength(50)]],
      locale: ['', [Validators.minLength(3), Validators.maxLength(50)]],
      task: ['', [Validators.minLength(3), Validators.maxLength(50)]],
      hint: ['', [Validators.required, Validators.minLength(20), Validators.maxLength(100)]],
      answer_type: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      answer: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      study: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      checked: ['', Validators.required]
    })
  }

  get challengeFormControls(): any {
    return this.challengeForm['controls'];
  }

  resetForm() {
    this.challengeForm.reset();
  }
}
