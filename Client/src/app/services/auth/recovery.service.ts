import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RecoveryService {

  recoverUri = environment.apiURL + 'user/sendEmailResetPassword/';
  resetPasswordUri = environment.apiURL + 'user/resetPassword/'

  constructor(private http: HttpClient) { }
  
  recoverPassword(email: string){
    return this.http.post(this.recoverUri + email, {});
  }

  resetPassword(token: string, newPassword: string){
    return this.http.post(this.resetPasswordUri + token, {password: newPassword});
  }
}