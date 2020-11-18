import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ChallengeService } from '../../services/game/challenge.service';
import { Study, StudyService } from '../../services/game/study.service'

@Component({
  selector: 'app-challenge-creation',
  templateUrl: './challenge-creation.component.html',
  styleUrls: ['./challenge-creation.component.css']
})
export class ChallengeCreationComponent implements OnInit {
  challengeForm: FormGroup;
  studies: Study[];

  constructor(private formBuilder: FormBuilder, private challengeService: ChallengeService, private studyService: StudyService) { }

  ngOnInit(): void {

    this.challengeForm = this.formBuilder.group({
      question: ['', [Validators.required, Validators.minLength(20), Validators.maxLength(300)]],
      seconds: ['', [Validators.required, Validators.maxLength(3), Validators.min(30)]],
      domain: ['', [Validators.minLength(3), Validators.maxLength(50)]],
      locale: ['', [Validators.minLength(3), Validators.maxLength(50)]],
      task: ['', [Validators.minLength(3), Validators.maxLength(50)]],
      hint: ['', [Validators.minLength(20), Validators.maxLength(100)]],
      answer_type: ['', [Validators.minLength(3), Validators.maxLength(50)]],
      answer: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(300)]],
      study: ['', Validators.required],
      checked: ['', Validators.required]
    });

    this.studyService.getStudies()
      .subscribe(response => this.studies = response['studys']);
  }

  get challengeFormControls(): any {
    return this.challengeForm['controls'];
  }

  resetForm() {
    this.challengeForm.reset();
  }

  createChallenge() {
    this.challengeService.postChallenge(this.challengeForm.value)
  }
  
}