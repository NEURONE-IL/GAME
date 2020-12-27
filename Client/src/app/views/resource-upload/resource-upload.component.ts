import { Component, OnInit , Input} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EndpointsService } from '../../services/endpoints/endpoints.service';
import { ResourceService } from '../../services/game/resource.service';
import { Study, StudyService } from '../../services/game/study.service';
import { Challenge, ChallengeService } from '../../services/game/challenge.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';

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
    { id: 1, value: 'document', show: 'UPLOAD.ARRAYS.DOC_TYPES.DOCUMENT' },
    { id: 2, value: 'image', show: 'UPLOAD.ARRAYS.DOC_TYPES.IMAGE' },
    { id: 3, value: 'book', show: 'UPLOAD.ARRAYS.DOC_TYPES.BOOK' },
    { id: 4, value: 'video', show: 'UPLOAD.ARRAYS.DOC_TYPES.VIDEO' }
  ];
  localeOptions = [
    { id: 1, value: 'en-US', show: 'UPLOAD.ARRAYS.LOCALE_OPTIONS.ENGLISH' },
    { id: 2, value: 'es-CL', show: 'UPLOAD.ARRAYS.LOCALE_OPTIONS.SPANISH' }
  ]

  constructor(private formBuilder: FormBuilder, private resourceService: ResourceService, private studyService: StudyService, private challengeService: ChallengeService, private endpointsService: EndpointsService, private toastr: ToastrService, private translate: TranslateService) { }

  ngOnInit(): void {
    this.getChallengesByStudy(this.study);
    this.resourceForm = this.formBuilder.group({
      docName: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      type: [null, [Validators.required]],
      title: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      url: [null, [Validators.required, Validators.minLength(5), Validators.maxLength(200)]],
      domain: this.study,
      locale: [null, [Validators.required]],
      task: [null, [Validators.required, Validators.minLength(10), Validators.maxLength(50)]],
      /*NEURONE required*/
      maskedURL: [null, [Validators.minLength(5), Validators.maxLength(200)]],
      relevant: false,
      searchSnippet: '',
      keywords: [[]],
      /*Validation*/
      checked: [null, Validators.required]
    });

    this.studyService.getStudies()
      .subscribe(response => this.studies = response['studys']);
  }

  get resourceFormControls(): any {
    return this.resourceForm['controls'];
  }

  resetForm() {
    this.resourceForm.reset();
    this.challenges.length = 0;
  }

  uploadResource(){
    let resource = this.resourceForm.value;
    console.log(resource);
    this.endpointsService.loadDocument(resource).subscribe(
      resource => {
        this.toastr.success(this.translate.instant("UPLOAD.TOAST.SUCCESS_MESSAGE") + ': ', this.translate.instant("UPLOAD.TOAST.SUCCESS"), {
          timeOut: 5000,
          positionClass: 'toast-top-center'
        });
        this.resetForm();
      },
      err => {
        this.toastr.error(this.translate.instant("UPLOAD.TOAST.ERROR_MESSAGE"), this.translate.instant("UPLOAD.TOAST.ERROR"), {
          timeOut: 5000,
          positionClass: 'toast-top-center'
        });
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
