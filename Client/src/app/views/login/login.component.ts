import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
  });
  }

  onSubmit(){
    this.authService.login(this.loginForm.value.email, this.loginForm.value.password);
    this.router.navigate(['start']);
  }

  redirectUserPanel(role) {
    console.log('redirect');
    if (role=='admin') {
      console.log('admin');
      this.router.navigate(['admin_panel']);
    } else {
      console.log('student');
      this.router.navigate(['start']);
    }
  }

}
