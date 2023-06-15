import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { StoreSessionService } from '../logger/store-session.service';

export interface User {
  _id: string,
  email: string,
  names: string,
  last_names: string,
  has_played: boolean,
  role: {
    _id: string,
    name: string,
  },
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  uri = environment.apiURL + 'auth/';
  userUri = environment.apiURL + 'user/';

  constructor(private http: HttpClient,
              private router: Router,
              private storeSession: StoreSessionService,
              private toastr: ToastrService,
              private translate: TranslateService) {}

  login(email: string, password: string) {
    
    this.http.post(this.uri + 'login', {email: email,password: password})
    .subscribe((resp: any) => {
      console.log(resp)
      localStorage.setItem('auth_token', resp.token);
      let user = resp.user;
      delete user.password;
      localStorage.setItem("currentUser",JSON.stringify(user));
      let sessionLog = {
        userId: resp.user._id,
        studyId: resp.user.study,
        userEmail: resp.user.email,
        state: 'login',
        localTimeStamp: Date.now()
      }
      this.storeSession.postSessionLog(sessionLog);
      this.redirectUserPanel(resp.user.role.name, false);
      },
      (error) => {
        let error_msg = this.translate.instant("LOGIN.TOAST.ERROR_MESSAGE");
        if (error.error=='EMAIL_NOT_FOUND') {
          error_msg = this.translate.instant("LOGIN.TOAST.ERROR_EMAIL_MESSAGE");
        }
        else if (error.error=='INVALID_PASSWORD') {
          error_msg = this.translate.instant("LOGIN.TOAST.ERROR_CREDENTIALS_MESSAGE");
        }
        else if (error.error=='USER_NOT_CONFIRMED') {
          error_msg = this.translate.instant("LOGIN.TOAST.ERROR_USER_NOT_CONFIRMED");
        }
        this.toastr.error(error_msg, this.translate.instant("LOGIN.TOAST.ERROR"), {
          timeOut: 5000,
          positionClass: 'toast-top-center'
        });
        this.router.navigate(['/']);
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
      studyId: this.getUser().study,
      challengeId: localStorage.getItem('chall'),
      state: 'logout',
      localTimeStamp: Date.now()
    }
    this.storeSession.postSessionLog(sessionLog);
    localStorage.removeItem('auth_token');
    localStorage.removeItem("currentUser");
    localStorage.removeItem("game");
    localStorage.removeItem('lastUrl')
    this.router.navigate(['login']);
  }

  logoutAPI_KEY() {
    let sessionLog = {
      userId: this.getUser()._id,
      userEmail: this.getUser().email,
      studyId: this.getUser().study,
      challengeId: localStorage.getItem('chall'),
      state: 'logout',
      localTimeStamp: Date.now()
    }
    this.storeSession.postSessionLog(sessionLog);
    var returnUrl = localStorage.getItem('return_url');
    localStorage.clear();
    window.location.href = returnUrl;
  }

  registerAPIKEY(email, names, study, trainer_id, api_key, url){
    let headers = new HttpHeaders().set('x-api-key', api_key); // create header object
    return this.http.post(environment.apiURL+ 'site/registeruser',{email: email, names: names, last_names: names, study: study, trainer_id: trainer_id, url: url} ,{headers: headers })
    .subscribe((resp: any) => {
      localStorage.setItem('auth_token', resp.token);
      localStorage.setItem("currentUser",JSON.stringify(resp.user));
      localStorage.setItem('return_url', url);
      let sessionLog = {
        userId: resp.user._id,
        userEmail: resp.user.email,
        state: 'login',
        localTimeStamp: Date.now()
      }
      this.storeSession.postSessionLog(sessionLog);
      this.redirectUserPanel(resp.user.role.name, true);
      },
      (error) => {
        let error_msg = this.translate.instant("LOGIN.TOAST.ERROR_MESSAGE");
        this.toastr.error(error_msg, this.translate.instant("LOGIN.TOAST.ERROR"), {
          timeOut: 5000,
          positionClass: 'toast-top-center'
        });
        this.router.navigate(['/']);
      }
      );
  }

  loginAPIKEY(study, trainer_id, api_key, url){
    let headers = new HttpHeaders().set('x-api-key', api_key); // create header object
    return this.http.post(environment.apiURL+ 'site/login',{study: study, trainer_id: trainer_id, url: url} ,{headers: headers })
    .subscribe((resp: any) => {
      localStorage.setItem('auth_token', resp.token);
      localStorage.setItem("currentUser",JSON.stringify(resp.user));
      localStorage.setItem('return_url', url);
      let sessionLog = {
        userId: resp.user._id,
        userEmail: resp.user.email,
        state: 'login',
        localTimeStamp: Date.now()
      }
      this.storeSession.postSessionLog(sessionLog);
      this.redirectUserPanel(resp.user.role.name, true);
      },
      (error) => {
        let error_msg = this.translate.instant("LOGIN.TOAST.ERROR_MESSAGE");
        this.toastr.error(error_msg, this.translate.instant("LOGIN.TOAST.ERROR"), {
          timeOut: 5000,
          positionClass: 'toast-top-center'
        });
        this.router.navigate(['/']);
      }
      );
  }

  checkTrainer(trainer_id){
    return this.http.get(environment.apiURL + 'site/user/' + trainer_id);
  }

  hasPlayed(): any{
    const id = JSON.parse(localStorage.getItem('currentUser'))._id;
    return this.http.get(environment.apiURL + 'user/' + id + '/has_played');
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
    delete userData.emailConfirm;
    return this.http.post(this.uri + 'register/' + study_id, userData);
  }

  getUserById(user_id){
    return this.http.get(this.userUri+user_id);
  }
  getUserByRole(user_id, role_id){
    return this.http.get(this.userUri+'getUserByRole/'+user_id+'/'+role_id);
  }
  getUserbyEmail(user_email){
    return this.http.get(this.userUri+'getUserbyEmail/'+user_email);
  }

  signupDummy(study_id){
    const user = {
      email: study_id+"@dummy.cl",
      names: "Dummy",
      last_names: "Dummy",
      password: "dummy12345"
    }
    return this.http.post(this.uri + 'registerDummy/' + study_id, user );
  }

  findDummy(study_id){
    return this.http.get(this.userUri + study_id + '/findDummy');
  }

  renewDummy(study_id){
    return this.http.get(this.userUri + study_id + '/resetDummy');
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

  refreshProgress() {
    return new Promise((resolve, reject) => {
      this.http.get(this.userUri + this.getUser()._id + '/progress', {})
      .subscribe((progress: any) => {
        resolve(progress);
      },
      (error) => {
        console.log('error fetching user progress');
        console.log(error);
        resolve(false);
      });
    });
  }

  updateProgress(body) {
    return new Promise((resolve, reject) => {
      this.http.put(this.userUri + this.getUser()._id + '/progress', body)
      .subscribe((progress: any) => {
        resolve(progress);
      },
      (error) => {
        console.log('error updating user');
        console.log(error);
        resolve(false);
      });
    });
  }

  redirectUserPanel(role, external) {
    console.log('redirect');
    if (role=='admin') {
      console.log('admin');
      this.router.navigate(['admin_panel']);
    } else {
      if(external){
        this.router.navigate(['/start']);
      }else{
        this.router.navigate(['/user-profile']);
      }
    }

  }

  canPlay() {
    return new Promise((resolve, reject) => {
      this.http.get(this.userUri + this.getUser()._id + '/can_play')
      .subscribe((canPlay: any) => {
        resolve(canPlay);
      },
      (error) => {
        resolve({canPlay: false});
      });
    });
  }

  getForward(course){
    return this.http.get(environment.apiURL + 'forward/' + course);
  }

  postForward(course, lastLink){
    return this.http.post(environment.apiURL + 'forward', {course: course, lastLink: lastLink});
  }

  checkEmail(email: string){
    console.log('check')
    return this.http.get(this.userUri + 'checkEmailAlreadyUsed/' + email);
  }

  getUsersByStudy(idstudy: string){
    return this.http.get(this.userUri + 'getUsersByStudy/' + idstudy);
  }
}
