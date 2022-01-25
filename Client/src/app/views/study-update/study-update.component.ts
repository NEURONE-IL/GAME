import { Component, Inject, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Study, StudyService } from '../../services/game/study.service';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-study-update',
  templateUrl: 'study-update.component.html',
  styleUrls: ['./study-update.component.css']
})
export class StudyUpdateComponent implements OnInit{
  studyForm: FormGroup;
  hours: number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24];
  maxPers: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25];
  minutes: number[] = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];
  loading: Boolean;
  file: File;

  constructor(@Inject(MAT_DIALOG_DATA)
    public study: Study,
    private formBuilder: FormBuilder,
    private studyService: StudyService,
    private toastr: ToastrService,
    private translate: TranslateService,
    public matDialog: MatDialog) { }

  ngOnInit(): void {
    /*Gets the cooldown in seconds and converts it to hours and minutes*/
    let seconds = this.study.cooldown;
    let hours = Math.trunc(seconds/3600);
    let minutes = Math.trunc(seconds/60)%60;
    console.log(seconds, hours, minutes)
    /*End*/
    this.studyForm = this.formBuilder.group({
      description: [this.study.description, [Validators.minLength(3), Validators.maxLength(250)]],
      name: [this.study.name, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      hours: [hours || ''],
      minutes: [minutes || ''],
      maxPerInterval: [this.study.max_per_interval || '', Validators.required]
    });
    this.loading = false;
  }

  get studyFormControls(): any {
    return this.studyForm['controls'];
  }

  resetForm() {
    this.studyForm.reset();
  }

  updateStudy(studyId: string){
    this.loading = true;
    let study = this.studyForm.value;
    let formData = new FormData();
    formData.append('name', study.name);
    if(study.description){
      formData.append('description', study.description);
    }
    if(study.hours !== ''){
      formData.append('hours', study.hours.toString());
    }else{
      formData.append('hours', '0');
    }
    if(study.minutes !== ''){
      formData.append('minutes', study.minutes.toString());
    }else{
      formData.append('minutes', '0');
    }
    formData.append('seconds', '0');
    if(study.maxPerInterval){
      formData.append('max_per_interval', study.maxPerInterval);
    }
    if(this.file){
      formData.append('file', this.file);
    }
    /*Check formData values*/
    for (var value of formData.entries()) {
      console.log(value[0]+ ', ' + value[1]);
    }
    /*End check formData values*/
    this.studyService.putStudy(studyId, formData).subscribe(
      study => {
        this.toastr.success(this.translate.instant("STUDY.TOAST.SUCCESS_MESSAGE_UPDATE") + ': ' + study['study'].name, this.translate.instant("STUDY.TOAST.SUCCESS"), {
          timeOut: 5000,
          positionClass: 'toast-top-center'
        });
        this.loading = false;
        this.matDialog.closeAll();
      },
      err => {
        this.toastr.error(this.translate.instant("STUDY.TOAST.ERROR_MESSAGE_UPDATE"), this.translate.instant("STUDY.TOAST.ERROR"), {
          timeOut: 5000,
          positionClass: 'toast-top-center'
        });
      }
    );
  }

  handleFileInput(files: FileList) {
    this.file = files.item(0);
  }
}