import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { EndpointsService } from '../endpoints/endpoints.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  uri = this.endpoints.rootURL + 'auth/';

  constructor(private http: HttpClient,private router: Router, private endpoints: EndpointsService) {}

  login(email: string, password: string) {
    this.http.post(this.uri + 'login', {email: email,password: password})
    .subscribe((resp: any) => {
      this.router.navigate(['admin_panel']);
      localStorage.setItem('auth_token', resp.token);
      },
      (error) => {
        this.router.navigate(['login']);
      }
      );
  }

    logout() {
      localStorage.removeItem('auth_token');
    }

    public get loggedIn(): boolean {
      return (localStorage.getItem('auth_token') !== null);
    }

    signup(userData: any, study_id: string) {
      this.http.post(this.uri + 'register/' + study_id, userData)
      .subscribe((resp: any) => {
        this.router.navigate(['admin_panel']);
        },
        (error) => {
          this.router.navigate(['signup']);
        }
        );
    }
}
