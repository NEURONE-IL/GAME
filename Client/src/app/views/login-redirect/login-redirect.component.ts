import { Component, OnInit } from '@angular/core';
import { ActivatedRoute} from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-login-redirect',
  templateUrl: './login-redirect.component.html',
  styleUrls: ['./login-redirect.component.css']
})
export class LoginRedirectComponent implements OnInit {

  exist: boolean = false;
  constructor(private route: ActivatedRoute, private authService: AuthService) { }

  ngOnInit(): void {
    const trainer_id = this.route.snapshot.paramMap.get('trainer_id');
    this.checkUser(trainer_id);
  }

  checkUser(trainer_id){
    this.authService.checkTrainer(trainer_id).subscribe(
      response => {
        this.exist = response['user'];
        if(this.exist){
          this.login()
        }
        else{
          this.register()
        }
      },
      err => {
        console.log(err)
      }
    )
  }

  login(){
    const study = this.route.snapshot.paramMap.get('study');
    const trainer_id = this.route.snapshot.paramMap.get('trainer_id');
    const api_key = this.route.snapshot.paramMap.get('api_key');
    const url = this.route.snapshot.paramMap.get('url').split("-").join("/");
    this.authService.loginAPIKEY(study, trainer_id, api_key, url)
  }

  register(){
    const email = this.route.snapshot.paramMap.get('email');
    const names = this.route.snapshot.paramMap.get('names');
    const study = this.route.snapshot.paramMap.get('study');
    const trainer_id = this.route.snapshot.paramMap.get('trainer_id');
    const api_key = this.route.snapshot.paramMap.get('api_key')
    const url = this.route.snapshot.paramMap.get('url').split("-").join("/");
    this.authService.registerAPIKEY(email, names, study, trainer_id, api_key, url)
  }

}
