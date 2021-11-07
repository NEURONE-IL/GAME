import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { StudyService } from '../../services/game/study.service';
import { AuthService } from '../../services/auth/auth.service';
import { SignupConstants } from './signup.constants';
import { getRegiones, getComunasByRegion } from 'dpacl';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

export class EmailAlreadyUsedValidator {
  static createValidator(authService: AuthService): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors> => {
      return authService.checkEmail(control.value).pipe(
        map((response: any) => response['message'] === 'EMAIL_ALREADY_USED' ? {emailAlreadyUsed: true} : null)
      );
    };
  }
}

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
  validStudy = true;
  isLoadingStudy = true;

  courses: any;
  regions: any;
  selectedRegion: any;
  communes: any;

  userSubmitted = false;

  constructor(private route: ActivatedRoute,
              private formBuilder: FormBuilder,
              private studyService: StudyService,
              private authService: AuthService,
              public router: Router,
              private toastr: ToastrService,
              private translate: TranslateService) {

    this.courses = SignupConstants.courses;
  }

  ngOnInit(): void {

    this.checkStudy();
    this.regions = getRegiones();

    this.consentForm = this.formBuilder.group({
      consent: [false, Validators.requiredTrue]
    });
    this.tutorForm = this.formBuilder.group({
      tutor_names: ['', [Validators.required, Validators.minLength(3)]],
      tutor_last_names: ['', [Validators.required, Validators.minLength(3)]],
      relation: ['', [Validators.required, Validators.minLength(1)]],
      email: ['', [Validators.email, Validators.required], [EmailAlreadyUsedValidator.createValidator(this.authService)]],
      emailConfirm: ['', [Validators.email, Validators.required]],
      tutor_phone: ['', [Validators.pattern("[0-9]{8,}")]]
    });
    this.studentForm = this.formBuilder.group({
      names: ['', [Validators.required, Validators.minLength(3)]],
      last_names: ['', [Validators.required, Validators.minLength(3)]],
      sex: ['', Validators.required],
      birthday: ['', Validators.required],
      course: ['', Validators.required],
      institution: ['', Validators.required],
      institution_commune: [{value: '', disabled: true}, Validators.required],
      institution_region: ['', Validators.required],
      password: ['', [Validators.required, Validators.pattern(/^(?=.*\d).{8,32}$/)]],
      password_confirmation: ['', [Validators.required, Validators.pattern(/^(?=.*\d).{8,32}$/)]]
    });
    console.log(!this.userSubmitted);
  }

  save() {
    let userData = Object.assign(this.tutorForm.value, this.studentForm.value);
    let regionString = this.regions.find(element => element.id = userData.institution_region).name;
    userData.institution_region = regionString;
    delete userData.password_confirmation;
    this.authService.signup(userData, this.route.snapshot.paramMap.get('study_id'))
      .subscribe((res) => {
        this.userSubmitted = true;
      },
      (err) => {
        if(err.error.message === 'EMAIL_ALREADY_USED'){
          this.toastr.error(this.translate.instant("SIGNUP.FORM.ERROR.EMAIL_ALREADY_USED"), this.translate.instant("CHALLENGE.TOAST.ERROR"), {
            timeOut: 10000,
            positionClass: 'toast-top-center'
          })
        }else{
          this.toastr.error(this.translate.instant("SIGNUP.FORM.ERROR.GENERIC_ERROR"), this.translate.instant("CHALLENGE.TOAST.ERROR"), {
            timeOut: 5000,
            positionClass: 'toast-top-center'
          })          
        }
        console.log(err);
      });
  }

  checkStudy() {
    const study_id = this.route.snapshot.paramMap.get('study_id');
    this.studyService.getStudySignup(study_id).subscribe(
      response => {
        this.study = response['study'];
        this.isLoadingStudy=false;
      },
      err => {
        this.toastr.error(this.translate.instant("STUDY.TOAST.NOT_LOADED_ERROR"), this.translate.instant("CHALLENGE.TOAST.ERROR"), {
          timeOut: 5000,
          positionClass: 'toast-top-center'
        });
        this.validStudy = false;
        this.isLoadingStudy=false;
      }
    );
  }

  onRegionChange(regionChange) {
    this.communes = getComunasByRegion(regionChange.value);
    this.studentFormControls.institution_commune.enable();
  }

  redirect(){
    localStorage.removeItem('study_id');
    this.router.navigate(['/login']);
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

  hide= true;
}
