import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RutValidator } from 'ng9-rut';
import { ActivatedRoute } from '@angular/router';
import { StudiesService } from '../../services/game/studies.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  consentForm: FormGroup;
  guardianForm: FormGroup;
  studentForm: FormGroup;
  study: any;

  constructor(private route: ActivatedRoute, private formBuilder: FormBuilder, private rutValidator: RutValidator, private studiesService: StudiesService) {
  }

  ngOnInit(): void {

    this.checkStudy();

    this.consentForm = this.formBuilder.group({
      consent: [false, Validators.requiredTrue]
    });
    this.guardianForm = this.formBuilder.group({
      names: ['', [Validators.required, Validators.minLength(3)]],
      lastNames: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.email, Validators.required]],
      rut: ['', [this.rutValidator, Validators.required]],
      phoneNumber: ['', [Validators.required, Validators.pattern("[0-9]{6,}")]]
    });
    this.studentForm = this.formBuilder.group({
      names: ['', [Validators.required, Validators.minLength(3)]],
      lastNames: ['', [Validators.required, Validators.minLength(3)]],
      birthdate: ['', Validators.required],
      grade: ['', Validators.required],
      school: ['', Validators.required],
      commune: ['', Validators.required],
      region: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(4)]],
      passwordConfirmation: ['', [Validators.required, Validators.minLength(4)]]
    });
  }

  save() {
    console.log(this.consentForm.value);
    console.log(this.guardianForm.value);
    console.log(this.studentForm.value);
  }

  printControls() {
    console.log(this.consentFormControls);
    console.log(this.guardianFormControls);
    console.log(this.studentFormControls);
  }

  checkStudy() {
    const study_id = this.route.snapshot.paramMap.get('study_id');
    this.studiesService.getStudy(study_id).subscribe(response => {
      this.study = response['study'];
    },
    (error) => {
      console.log("couldn't access study");
    });
  }

  get consentFormControls(): any {
    return this.consentForm['controls'];
  }

  get guardianFormControls(): any {
    return this.guardianForm['controls'];
  }

  get studentFormControls(): any {
    return this.studentForm['controls'];
  }
}
