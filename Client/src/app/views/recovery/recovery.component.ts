import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
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
  token: string;

  constructor(private formBuilder: FormBuilder,
              private recoveryService: RecoveryService,
              private route: ActivatedRoute,
              private router: Router,
              private toastr: ToastrService,
              private translate: TranslateService) { }

  ngOnInit(): void {
    this.recoveryForm = this.formBuilder.group({
      newPassword: ['', [Validators.required, Validators.pattern(/^(?=.*\d).{8,32}$/)]],
      passwordConfirmation: ['', [Validators.required, Validators.pattern(/^(?=.*\d).{8,32}$/)]]
    });

    this.route.paramMap.subscribe((params: ParamMap) => {
      this.token = params.get('token');
    });    

    console.log(this.token);
  }

  goBack(){
    this.router.navigate(['login']);
  }

  get recoveryFormControls(): any {
    return this.recoveryForm['controls'];
  }  

  resetPassword(){
    this.recoveryService.resetPassword(this.token, this.recoveryForm.value.newPassword).subscribe(
      () => {
        this.toastr.success(this.translate.instant("RESET_PASSWORD.TOAST.SUCCESS_MESSAGE"), this.translate.instant("RESET_PASSWORD.TOAST.SUCCESS"), {
          timeOut: 5000,
          positionClass: 'toast-top-center'
        });
        this.router.navigate(['login']);
      },
      err => {
        this.toastr.error(this.translate.instant("RESET_PASSWORD.TOAST.ERROR_MESSAGE"), this.translate.instant("RESET_PASSWORD.TOAST.ERROR"), {
          timeOut: 5000,
          positionClass: 'toast-top-center'
        });      
      }
    );
  }
}
