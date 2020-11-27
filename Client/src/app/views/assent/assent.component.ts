import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-assent',
  templateUrl: './assent.component.html',
  styleUrls: ['./assent.component.css']
})
export class AssentComponent implements OnInit {

  assentForm: FormGroup;
  @Output() onSaveClick = new EventEmitter();

  constructor(private formBuilder: FormBuilder,) { }

  ngOnInit(): void {
    this.assentForm = this.formBuilder.group({
      assent: [false, Validators.requiredTrue]
    });
  }

  get assentFormControls(): any {
    return this.assentForm['controls'];
  }

  save() {
    this.onSaveClick.emit();
    console.log(this.assentForm.value);
  }

}
