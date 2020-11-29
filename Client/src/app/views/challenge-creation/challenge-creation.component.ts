import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ChallengeService } from '../../services/game/challenge.service';
import { Study, StudyService } from '../../services/game/study.service';

@Component({
  selector: 'app-challenge-creation',
  templateUrl: './challenge-creation.component.html',
  styleUrls: ['./challenge-creation.component.css']
})
export class ChallengeCreationComponent implements OnInit {
  challengeForm: FormGroup;
  studies: Study[];
  questionOptions = [
    { id: 1, value: 'page', show: 'Página web' },
    { id: 2, value: 'image', show: 'Imagen' },
    { id: 3, value: 'book', show: 'Libro' },
    { id: 4, value: 'video', show: 'Vídeo' }
  ];
  answerOptions = [
    { id: 1, value: 'string', show: 'Texto' },
    { id: 2, value: 'number', show: 'Número' },
    { id: 3, value: 'url', show: 'URL' },
    { id: 4, value: 'video', show: 'Vídeo' }
  ];  

  constructor(private formBuilder: FormBuilder, private challengeService: ChallengeService, private studyService: StudyService) { }

  ngOnInit(): void {

    this.challengeForm = this.formBuilder.group({
      question: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(300)]],
      question_type: ['', Validators.required],
      seconds: ['', [Validators.required, Validators.maxLength(3), Validators.min(30)]],
      hint: ['', [Validators.minLength(10), Validators.maxLength(100)]],
      answer_type: ['', [Validators.minLength(3), Validators.maxLength(50)]],
      answer: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(300)]],
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