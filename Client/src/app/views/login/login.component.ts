import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;

  constructor(private formBuilder: FormBuilder,
              private authService: AuthService,
              private router: Router,
              private toastr: ToastrService,
              private translate: TranslateService) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
  });
    if(this.router.url === '/login/confirmedOK') {
      this.showConfirmedToastr();
    }
  }

  onSubmit(){
    this.authService.login(this.loginForm.value.email, this.loginForm.value.password);
  }

  showConfirmedToastr() {
    this.translate.get(["LOGIN.TOAST.SUCCESS", "LOGIN.TOAST.USER_CONFIRMED"]).subscribe((res) => {
      this.toastr.success(res["LOGIN.TOAST.USER_CONFIRMED"], res["LOGIN.TOAST.SUCCESS"], {
        timeOut: 5000,
        positionClass: 'toast-top-center'
      });
    });
  }

  redirectUserPanel(role) {
    console.log('redirect');
    if (role=='admin') {
      console.log('admin');
      this.router.navigate(['admin_panel']);
    } else {
      console.log('student');
      this.router.navigate(['user-profile']);
    }
  }

  showRecovery(){
    this.router.navigate(['forgot_password']); 
  }
}
