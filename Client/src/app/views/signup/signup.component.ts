import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RutValidator } from 'ng9-rut';
import { ActivatedRoute } from '@angular/router';
import { StudyService } from '../../services/game/study.service';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  consentForm: FormGroup;
  tutorForm: FormGroup;
  studentForm: FormGroup;
  study: any;

  constructor(private route: ActivatedRoute,
              private formBuilder: FormBuilder,
              private rutValidator: RutValidator,
              private studyService: StudyService,
              private authService: AuthService) {
  }

  ngOnInit(): void {

    this.checkStudy();

    this.consentForm = this.formBuilder.group({
      consent: [false, Validators.requiredTrue]
    });
    this.tutorForm = this.formBuilder.group({
      tutor_names: ['', [Validators.required, Validators.minLength(3)]],
      tutor_last_names: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.email, Validators.required]],
      tutor_rut: ['', [this.rutValidator, Validators.required]],
      tutor_phone: ['', [Validators.required, Validators.pattern("[0-9]{6,}")]]
    });
    this.studentForm = this.formBuilder.group({
      names: ['', [Validators.required, Validators.minLength(3)]],
      last_names: ['', [Validators.required, Validators.minLength(3)]],
      birthday: ['', Validators.required],
      course: ['', Validators.required],
      institution: ['', Validators.required],
      institution_commune: ['', Validators.required],
      institution_region: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(4)]],
      password_confirmation: ['', [Validators.required, Validators.minLength(4)]]
    });
  }

  save() {
    let userData = Object.assign(this.tutorForm.value, this.studentForm.value);
    delete userData.password_confirmation;
    this.authService.signup(userData, this.route.snapshot.paramMap.get('study_id'));
  }

  checkStudy() {
    const study_id = this.route.snapshot.paramMap.get('study_id');
    this.studyService.getStudy(study_id).subscribe(response => {
      this.study = response['study'];
    },
    (error) => {
      console.log("couldn't access study");
    });
  }

  get consentFormControls(): any {
    return this.consentForm['controls'];
  }

  get tutorFormControls(): any {
    return this.tutorForm['controls'];
  }

  get studentFormControls(): any {
    return this.studentForm['controls'];
  }
}
