import { Component, OnInit } from '@angular/core';
import { ActivatedRoute} from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-login-redirect',
  templateUrl: './login-redirect.component.html',
  styleUrls: ['./login-redirect.component.css']
})
export class LoginRedirectComponent implements OnInit {

  constructor(private route: ActivatedRoute, private authService: AuthService) { }

  ngOnInit(): void {
    if(this.route.snapshot.paramMap.get('email')){
      this.register()
    }
    else{
      this.login()
    }
  }

  login(){
    const study = this.route.snapshot.paramMap.get('study');
    const trainer_id = this.route.snapshot.paramMap.get('trainer_id');
    const api_key = this.route.snapshot.paramMap.get('api_key')
    this.authService.loginAPIKEY(study, trainer_id, api_key)
  }

  register(){
    const email = this.route.snapshot.paramMap.get('email');
    const names = this.route.snapshot.paramMap.get('names');
    const study = this.route.snapshot.paramMap.get('study');
    const trainer_id = this.route.snapshot.paramMap.get('trainer_id');
    const api_key = this.route.snapshot.paramMap.get('api_key')
    this.authService.registerAPIKEY(email, names, study, trainer_id, api_key)
  }

}
