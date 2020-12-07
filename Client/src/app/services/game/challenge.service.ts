import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EndpointsService } from '../endpoints/endpoints.service';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';

export interface Challenge {
  _id: string,
  question: string,
  seconds: number,
  domain: string,
  locale: string,
  task: string,
  hint: string,
  answer_type: string,
  answer: string,
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
      if(cleanChallenge[property] === ''){
        delete cleanChallenge[property];
      }
    }
    /*Sends the request*/
    return this.http.post(this.uri, cleanChallenge, { headers: {'x-access-token': localStorage.getItem('auth_token')} });
  }

  postAnswer(challenge: any, answer: any, timeLeft: number) {
    const formattedAnswer = {
      user: this.authService.getUser(),
      challenge: challenge,
      answers: [
        {
          answer
        }
      ],
      timeLeft: timeLeft
    }
    return this.http.post(this.uri + 'answer/', formattedAnswer, { headers: {'x-access-token': localStorage.getItem('auth_token')} });
  }
}
