import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-resources-upload',
  templateUrl: './resources-upload.component.html',
  styleUrls: ['./resources-upload.component.css']
})
export class ResourcesUploadComponent implements OnInit {
  uploadForm: FormGroup;
  docTypes = [
    { id: 1, typeOf: 'document', show: 'Documento' },
    { id: 2, typeOf: 'image', show: 'Imagen' },
    { id: 3, typeOf: 'book', show: 'Libro' },
    { id: 4, typeOf: 'video', show: 'Vídeo' }
  ];

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {

    this.uploadForm = this.formBuilder.group({
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

  get uploadFormControls(): any {
    return this.uploadForm['controls'];
  }

  resetForm() {
    this.uploadForm.reset();
  }
}
