import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EndpointsService } from '../endpoints/endpoints.service';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';

export interface Challenge {
  _id: string,
  question: string,
  question_type: string,
  number: number,
  seconds: number,
  hint: string,
  answer_type: string,
  answer: string,
  max_attempts: string,
  study: string,
  createdAt: string,
  updatedAt: string
}

@Injectable({
  providedIn: 'root'
})
export class ChallengeService {

  uri = this.endpoints.rootURL + 'challenge/';

  constructor(protected http: HttpClient,
              private endpoints: EndpointsService,
              private authService: AuthService) { }

  getChallenges(): Observable<any> {
    return this.http.get(this.uri);
  }

  getChallengesByStudy(studyId: string): Observable<any> {
    return this.http.get('http://localhost:3090/api/challenge/byStudy/'+studyId)
  }

  getChallenge(id: string) {
    return this.http.get(this.uri+id);
  }

  postChallenge(challenge: any) {
    /*Includes just the non empty properties and excludes the checked property used for validation*/
    let cleanChallenge = Object.assign(new Object, challenge);
    delete cleanChallenge.checked;
    /*Iterates through the object to remove the empty properties*/
    for (const property in cleanChallenge) {
      if(cleanChallenge[property] === '' || cleanChallenge[property] === null){
        delete cleanChallenge[property];
      }
    }
    console.log(cleanChallenge)
    /*Sends the request*/
    return this.http.post(this.uri, cleanChallenge, { headers: {'x-access-token': localStorage.getItem('auth_token')} });
  }
 
  putChallenge(id: string, updatedChallenge: any): Observable<any> {
    return this.http.put(this.uri+id, updatedChallenge);
  }  

  deleteChallenge(id: string): Observable<any> {
    return this.http.delete(this.uri+id);
  }  
 
  postAnswer(challenge: any, answer: any, timeLeft: number, hintUsed: boolean) {
    const formattedAnswer = {
      user: this.authService.getUser(),
      challenge: challenge,
      answers: [
        {
          answer
        }
      ],
      timeLeft: timeLeft,
      hintUsed: hintUsed
    }
    return this.http.post(this.uri + 'answer/', formattedAnswer, { headers: {'x-access-token': localStorage.getItem('auth_token')} });
  }

  postAnswerFromTimeOut(challenge: any, timeLeft: number, hintUsed: boolean) {
    const formattedAnswer = {
      user: this.authService.getUser(),
      challenge: challenge,
      timeLeft: timeLeft,
      hintUsed: hintUsed
    }
    return this.http.post(this.uri + 'answer/', formattedAnswer, { headers: {'x-access-token': localStorage.getItem('auth_token')} });
  }  
}
