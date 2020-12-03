import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StudyService } from '../../services/game/study.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-study-creation',
  templateUrl: './study-creation.component.html',
  styleUrls: ['./study-creation.component.css']
})
export class StudyCreationComponent implements OnInit {
  studyForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private studyService: StudyService, private toastr: ToastrService, private translate: TranslateService) { }

  ngOnInit(): void {

    this.studyForm = this.formBuilder.group({
      description: ['', [Validators.minLength(10), Validators.maxLength(250)]],
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      checked: ['', Validators.required]      
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
    this.studyService.postStudy(study).subscribe(
      study => {
        this.toastr.success(this.translate.instant("STUDY.TOAST.SUCCESS_MESSAGE") + ': ' + study['study'].name, this.translate.instant("STUDY.TOAST.SUCCESS"), {
          timeOut: 5000,
          positionClass: 'toast-top-center'
        });
        this.resetForm();
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