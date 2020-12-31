import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { EndpointsService } from '../endpoints/endpoints.service';
import { StoreSessionService } from '../logger/store-session.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  uri = this.endpoints.rootURL + 'auth/';
  userUri = this.endpoints.rootURL + 'user/';

  constructor(private http: HttpClient,private router: Router,
              private endpoints: EndpointsService,
              private storeSession: StoreSessionService,
              private toastr: ToastrService,
              private translate: TranslateService) {}

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
      this.storeSession.postSessionLog(sessionLog);
      this.redirectUserPanel(resp.user.role.name);
      },
      (error) => {
        let error_msg = this.translate.instant("LOGIN.TOAST.ERROR_MESSAGE");
        if (error.error=='EMAIL_NOT_FOUND') {
          error_msg = this.translate.instant("LOGIN.TOAST.ERROR_EMAIL_MESSAGE");
        }
        else if (error.error=='INVALID_PASSWORD') {
          error_msg = this.translate.instant("LOGIN.TOAST.ERROR_CREDENTIALS_MESSAGE");
        }
        else if (error.error='USER_NOT_CONFIRMED') {
          error_msg = this.translate.instant("LOGIN.TOAST.ERROR_USER_NOT_CONFIRMED");
        }
        this.toastr.error(error_msg, this.translate.instant("LOGIN.TOAST.ERROR"), {
          timeOut: 5000,
          positionClass: 'toast-top-center'
        });
        this.router.navigate(['login']);
      }
      );
  }

  confirmLogout() {
    confirm(this.translate.instant("LOGOUT.LOGOUT_CONFIRMATION")) && this.logout();
  }

  logout() {
    let sessionLog = {
      userId: this.getUser()._id,
      userEmail: this.getUser().email,
      state: 'logout',
      localTimeStamp: Date.now()
    }
    this.storeSession.postSessionLog(sessionLog);
    localStorage.removeItem('auth_token');
    localStorage.removeItem("currentUser");
    localStorage.removeItem("game");
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

  public getUser() {
    return JSON.parse(localStorage.getItem('currentUser'));
  }

  signup(userData: any, study_id: string) {
    return this.http.post(this.uri + 'register/' + study_id, userData);
    // .subscribe((resp: any) => {
    //   this.router.navigate(['/']);
    //   },
    //   (error) => {
    //     this.router.navigate(['signup']);
    //   }
    //   );
  }

  updateUser(body) {
    return new Promise((resolve, reject) => {
      this.http.put(this.userUri + this.getUser()._id, body)
      .subscribe((res: any) => {
        localStorage.setItem("currentUser",JSON.stringify(res.user));
        resolve(true);
      },
      (error) => {
        console.log('error updating user');
        console.log(error);
        resolve(false);
      });
    });
  }

  refreshUser() {
    return new Promise((resolve, reject) => {
      this.http.put(this.userUri + this.getUser()._id, {})
      .subscribe((res: any) => {
        localStorage.setItem("currentUser",JSON.stringify(res.user));
        resolve(true);
      },
      (error) => {
        console.log('error updating user');
        console.log(error);
        resolve(false);
      });
    });
  }

  redirectUserPanel(role) {
    console.log('redirect');
    if (role=='admin') {
      console.log('admin');
      this.router.navigate(['admin_panel']);
    } else {
      // this.router.navigate(['questionnaire/initial']);
      // this.router.navigate(['questionnaire/pre-test']);
      this.router.navigate(['start']);
    }
  }
}
