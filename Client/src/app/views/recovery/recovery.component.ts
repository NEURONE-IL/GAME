import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { RecoveryService } from '../../services/auth/recovery.service';

@Component({
  selector: 'app-recovery',
  templateUrl: './recovery.component.html',
  styleUrls: ['./recovery.component.css']
})
export class RecoveryComponent implements OnInit {

  recoveryForm: FormGroup;

  constructor(private formBuilder: FormBuilder,
              private recoveryService: RecoveryService,
              private router: Router,
              private toastr: ToastrService,
              private translate: TranslateService) { }

  ngOnInit(): void {
    this.recoveryForm = this.formBuilder.group({
      newPassword: ['', [Validators.required, Validators.pattern(/^(?=.*\d).{8,32}$/)]],
      passwordConfirmation: ['', [Validators.required, Validators.pattern(/^(?=.*\d).{8,32}$/)]]
    })
  }

  goBack(){
    this.router.navigate(['login']);
  }

  get recoveryFormControls(): any {
    return this.recoveryForm['controls'];
  }  

  recoverPassword(){
/*    this.recoveryService.recoverPassword(this.recoveryForm.value.email).subscribe(
      response => {
        this.toastr.success(this.translate.instant("RECOVERY.TOAST.SUCCESS_MESSAGE"), this.translate.instant("RECOVERY.TOAST.SUCCESS"), {
          timeOut: 5000,
          positionClass: 'toast-top-center'
        });
      },
      err => {
        this.toastr.error(this.translate.instant("RECOVERY.TOAST.ERROR_MESSAGE"), this.translate.instant("RECOVERY.TOAST.ERROR"), {
          timeOut: 5000,
          positionClass: 'toast-top-center'
        });      
      });
    }*/
  }
}
