import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { RecoveryService } from '../../services/auth/recovery.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  forgotPasswordForm: FormGroup;

  constructor(private formBuilder: FormBuilder,
              private recoveryService: RecoveryService,
              private router: Router,
              private toastr: ToastrService,
              private translate: TranslateService) { }

  ngOnInit(): void {
    this.forgotPasswordForm = this.formBuilder.group({
      email: ['', [Validators.email, Validators.required]]
    })
  }

  goBack(){
    this.router.navigate(['login']);
  }

  get forgotPasswordFormControls(): any {
    return this.forgotPasswordForm['controls'];
  }  

  recoverPassword(){
    this.recoveryService.recoverPassword(this.forgotPasswordForm.value.email).subscribe(
      () => {
        this.toastr.success(this.translate.instant("RECOVERY.TOAST.SUCCESS_MESSAGE"), this.translate.instant("RECOVERY.TOAST.SUCCESS"), {
          timeOut: 10000,
          positionClass: 'toast-top-center'
        });
        this.router.navigate(['login']);
      },
      err => {
        this.toastr.error(this.translate.instant("RECOVERY.TOAST.ERROR_MESSAGE"), this.translate.instant("RECOVERY.TOAST.ERROR"), {
          timeOut: 5000,
          positionClass: 'toast-top-center'
        });      
      }
    );
  }  
}