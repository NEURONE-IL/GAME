import { Component, OnInit , Input} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EndpointsService } from '../../services/endpoints/endpoints.service';
import { ResourceService } from '../../services/game/resource.service';
import { Study, StudyService } from '../../services/game/study.service';
import { Challenge, ChallengeService } from '../../services/game/challenge.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-resource-upload',
  templateUrl: './resource-upload.component.html',
  styleUrls: ['./resource-upload.component.css']
})
export class ResourceUploadComponent implements OnInit {
  @Input() study: string;
  resourceForm: FormGroup;
  studies: Study[];
  challenges: Challenge[];
  docTypes = [
    { id: 1, value: 'document', show: 'UPLOAD.ARRAYS.DOC_TYPES.WEB_PAGE' },
//    { id: 2, value: 'image', show: 'UPLOAD.ARRAYS.DOC_TYPES.IMAGE' },
    { id: 3, value: 'book', show: 'UPLOAD.ARRAYS.DOC_TYPES.BOOK' },
    { id: 4, value: 'video', show: 'UPLOAD.ARRAYS.DOC_TYPES.VIDEO' }
  ];
  loading: Boolean;

  constructor(private formBuilder: FormBuilder, private resourceService: ResourceService, private studyService: StudyService, private challengeService: ChallengeService, private endpointsService: EndpointsService, private toastr: ToastrService, private translate: TranslateService) { }

  ngOnInit(): void {
    this.getChallengesByStudy(this.study);
    this.resourceForm = this.formBuilder.group({
      docName: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      type: [null, [Validators.required]],
      title: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      url: [null, [Validators.required, Validators.minLength(5), Validators.maxLength(200)]],
      domain: this.study,
      locale: environment.locale,
      task: [null, []],
      /*NEURONE required*/
      maskedURL: [null, [Validators.minLength(5), Validators.maxLength(200)]],
      relevant: null,
      searchSnippet: '',
      keywords: [[]],
    });

    this.studyService.getStudies().subscribe(
      response => {
        this.studies = response['studys'];
      },
      err => {
        this.toastr.error(this.translate.instant("STUDY.TOAST.NOT_LOADED_MULTIPLE_ERROR"), this.translate.instant("CHALLENGE.TOAST.ERROR"), {
          timeOut: 5000,
          positionClass: 'toast-top-center'
        });
      }
    );

    this.loading = false;
  }

  get resourceFormControls(): any {
    return this.resourceForm['controls'];
  }

  resetForm() {
    this.resourceForm.reset();
    this.resourceForm.controls['domain'].setValue(this.study);
  }

  uploadResource(){
    this.loading = true;
    let resource = this.resourceForm.value;
    console.log(resource);
    if(resource.task === null){
      resource.task = "dummy";
    }
    this.endpointsService.loadDocument(resource).subscribe(
      resource => {
        this.toastr.success(this.translate.instant("UPLOAD.TOAST.SUCCESS_MESSAGE"), this.translate.instant("UPLOAD.TOAST.SUCCESS"), {
          timeOut: 5000,
          positionClass: 'toast-top-center'
        });
        this.resetForm();
        this.loading = false;
      },
      err => {
        if(err.error.msg === 'COULDNT_DOWNLOAD_DOC'){
          this.toastr.error(this.translate.instant("UPLOAD.TOAST.ERROR_" + err.error.msg), this.translate.instant("UPLOAD.TOAST.ERROR"), {
            timeOut: 5000,
            positionClass: 'toast-top-center'
          });
          this.loading = false;
        }else{
          this.toastr.error(this.translate.instant("UPLOAD.TOAST.ERROR_MESSAGE"), this.translate.instant("UPLOAD.TOAST.ERROR"), {
            timeOut: 5000,
            positionClass: 'toast-top-center'
          });
          this.loading = false;          
        }
        console.log(err);
      }
    );
  }

  getChallengesByStudy(studyId: any){
    this.challengeService.getChallengesByStudy(studyId)
      .subscribe(response => this.challenges = response['challenges']);
  }

  sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
