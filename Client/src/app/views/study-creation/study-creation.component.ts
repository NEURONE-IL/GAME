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
  hours: number[] = [1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24];
  minutes: number[] = [10, 15, 20, 25, 30, 35, 40, 45, 50];
  seconds: number[] = [10, 15, 20, 25, 30, 35, 40, 45, 50];

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
      checked: ['', Validators.required],
      hours: [''],
      minutes: [''],
      seconds: ['']
    })
  }

  get studyFormControls(): any {
    return this.studyForm['controls'];
  }

  resetForm() {
    this.studyForm.reset();
  }

  createStudy(){
    let study = this.studyForm.value;
    console.log(study)
    this.studyService.postStudy(study).subscribe(
      study => {
        this.toastr.success(this.translate.instant("STUDY.TOAST.SUCCESS_MESSAGE") + ': ' + study['study'].name, this.translate.instant("STUDY.TOAST.SUCCESS"), {
          timeOut: 5000,
          positionClass: 'toast-top-center'
        });
        this.resetForm();
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
