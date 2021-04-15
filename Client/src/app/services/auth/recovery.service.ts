import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RecoveryService {

  recoverUri = environment.apiURL + 'user/sendEmailResetPassword/';

  constructor(private http: HttpClient, 
              private router: Router) { }
  
  recoverPassword(email: string){
    return this.http.post(this.recoverUri + email, {});
  }
}