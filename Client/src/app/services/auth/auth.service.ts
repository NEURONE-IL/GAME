import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { EndpointsService } from '../endpoints/endpoints.service';
import { LoggerService } from '../game/logger.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  uri = this.endpoints.rootURL + 'auth/';

  constructor(private http: HttpClient,private router: Router, private endpoints: EndpointsService, private logger: LoggerService) {}

  login(email: string, password: string) {
    this.http.post(this.uri + 'login', {email: email,password: password})
    .subscribe((resp: any) => {
      localStorage.setItem('auth_token', resp.token);
      localStorage.setItem("currentUser",JSON.stringify(resp.user));
      let sessionLog = {
        userId: resp.user._id,
        userEmail: resp.user.email,
        state: 'login',
        localTimeStamp: Date.now()
      }
      this.logger.postSessionLog(sessionLog).subscribe(()=> {

      });
      this.redirectUserPanel(resp.user.role.name);
      },
      (error) => {
        this.router.navigate(['login']);
      }
      );
  }

  logout() {
    const obj = JSON.parse(localStorage.getItem('currentUser'));
    let sessionLog = {
      userId: obj._id,
      userEmail: obj.email,
      state: 'login',
      localTimeStamp: Date.now()
    }
    localStorage.removeItem('auth_token');
    localStorage.removeItem("currentUser");
    this.router.navigate(['login']);
  }

  public get loggedIn(): boolean {
    return (localStorage.getItem('auth_token') !== null);
  }

  public isAdmin(): any {
    const role = JSON.parse(localStorage.getItem('currentUser')).role;
    if (role.name=='admin') return true;
    else return false;
  }

  public getUser(): any {
    return JSON.parse(localStorage.getItem('currentUser'));
  }

  signup(userData: any, study_id: string) {
    this.http.post(this.uri + 'register/' + study_id, userData)
    .subscribe((resp: any) => {
      this.router.navigate(['/']);
      },
      (error) => {
        this.router.navigate(['signup']);
      }
      );
  }

  redirectUserPanel(role) {
    console.log('redirect');
    if (role=='admin') {
      console.log('admin');
      this.router.navigate(['admin_panel']);
    } else {
      this.router.navigate(['start']);
    }
  }
}
