import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ChallengeService } from '../../services/game/challenge.service';
import { Study, StudyService } from '../../services/game/study.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';

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

  constructor(private formBuilder: FormBuilder, private router: Router, private challengeService: ChallengeService, private studyService: StudyService, private toastr: ToastrService, private translate: TranslateService) { }

  ngOnInit(): void {

    this.challengeForm = this.formBuilder.group({
      question: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(300)]],
      question_type: ['', Validators.required],
      seconds: ['', [Validators.required, Validators.maxLength(3), Validators.min(30)]],
      max_attempts: ['', [Validators.required, Validators.maxLength(2), Validators.min(1)]],
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

  createChallenge(){
    let challenge = this.challengeForm.value;
    this.challengeService.postChallenge(challenge).subscribe(
      challenge => {
        this.toastr.success(this.translate.instant("CHALLENGE.TOAST.SUCCESS_MESSAGE") + ': ' + challenge['challenge'].question, this.translate.instant("CHALLENGE.TOAST.SUCCESS"), {
          timeOut: 5000,
          positionClass: 'toast-top-center'
        });
        this.router.navigate(['/admin_panel']);
        this.resetForm();
      },
      err => {
        this.toastr.error(this.translate.instant("CHALLENGE.TOAST.ERROR_MESSAGE"), this.translate.instant("CHALLENGE.TOAST.ERROR"), {
          timeOut: 5000,
          positionClass: 'toast-top-center'
        });
      }
    );
  }
}
