import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ResourceService } from '../../services/game/resource.service';

@Component({
  selector: 'app-resource-upload',
  templateUrl: './resource-upload.component.html',
  styleUrls: ['./resource-upload.component.css']
})
export class ResourceUploadComponent implements OnInit {
  resourceForm: FormGroup;
  docTypes = [
    { id: 1, typeOf: 'document', show: 'Documento' },
    { id: 2, typeOf: 'image', show: 'Imagen' },
    { id: 3, typeOf: 'book', show: 'Libro' },
    { id: 4, typeOf: 'video', show: 'Vídeo' }
  ];

  constructor(private formBuilder: FormBuilder, private resourceService: ResourceService) { }

  ngOnInit(): void {

    this.resourceForm = this.formBuilder.group({
      docName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      docType: ['', [Validators.required]],
      title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      url: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(200)]],
      domain: ['', [Validators.minLength(10), Validators.maxLength(50)]],
      locale: ['', [Validators.minLength(10), Validators.maxLength(50)]],
      task: ['', [Validators.minLength(10), Validators.maxLength(50)]],
      checked: ['', Validators.required]
    })
  }

  get resourceFormControls(): any {
    return this.resourceForm['controls'];
  }

  resetForm() {
    this.resourceForm.reset();
  }

  uploadResource() {
    this.resourceService.postResource(this.resourceForm);
  }
}