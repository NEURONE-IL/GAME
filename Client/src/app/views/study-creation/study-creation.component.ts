import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StudyService } from '../../services/game/study.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-study-creation',
  templateUrl: './study-creation.component.html',
  styleUrls: ['./study-creation.component.css']
})
export class StudyCreationComponent implements OnInit {
  studyForm: FormGroup;
  hours: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24];
  minutes: number[] = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];
  seconds: number[] = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];
  loading: Boolean;

  constructor(
    private formBuilder: FormBuilder,
    private studyService: StudyService,
    private toastr: ToastrService,
    private translate: TranslateService,
    private router: Router) { }

  ngOnInit(): void {

    this.studyForm = this.formBuilder.group({
      description: ['', [Validators.minLength(10), Validators.maxLength(250)]],
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      hours: ['', [Validators.required]],
      minutes: ['', [Validators.required]],
      seconds: [0]
    });

    this.loading = false;
  }

  get studyFormControls(): any {
    return this.studyForm['controls'];
  }

  resetForm() {
    this.studyForm.reset();
  }

  createStudy(){
    this.loading = true;
    let study = this.studyForm.value;
    console.log(study)
    this.studyService.postStudy(study).subscribe(
      study => {
        this.toastr.success(this.translate.instant("STUDY.TOAST.SUCCESS_MESSAGE") + ': ' + study['study'].name, this.translate.instant("STUDY.TOAST.SUCCESS"), {
          timeOut: 5000,
          positionClass: 'toast-top-center'
        });
        this.resetForm();
        this.loading = false;
        this.router.navigate(['admin_panel']);
      },
      err => {
        this.toastr.error(this.translate.instant("STUDY.TOAST.ERROR_MESSAGE"), this.translate.instant("STUDY.TOAST.ERROR"), {
          timeOut: 5000,
          positionClass: 'toast-top-center'
        });
      }
    );
  }
}
