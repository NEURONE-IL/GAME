import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
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

  uri = environment.apiURL + 'challenge/';

  constructor(protected http: HttpClient,
              private authService: AuthService) { }

  getChallenges(): Observable<any> {
    return this.http.get(this.uri);
  }

  getChallengesByStudy(studyId: string): Observable<any> {
    return this.http.get(environment.apiURL +'challenge/byStudy/'+studyId)
  }

  getChallenge(id: string) {
    return this.http.get(this.uri+id);
  }

  postChallenge(challenge: any) {
    /*Iterates through the object to remove the empty properties*/
    for (const property in challenge) {
      if(challenge[property] === '' || challenge[property] === null){
        delete challenge[property];
      }
    }
    console.log(challenge)
    /*Sends the request*/
    return this.http.post(this.uri, challenge, { headers: {'x-access-token': localStorage.getItem('auth_token')} });
  }

  putChallenge(id: string, updatedChallenge: any): Observable<any> {
    /*Iterates through the object to remove the empty properties*/
    for (const property in updatedChallenge) {
      if(updatedChallenge[property] === '' || updatedChallenge[property] === null){
        delete updatedChallenge[property];
      }
    }
    console.log(updatedChallenge)
    /*Sends the request*/
    return this.http.put(this.uri+id, updatedChallenge, { headers: {'x-access-token': localStorage.getItem('auth_token')} });
  }

  deleteChallenge(id: string): Observable<any> {
    return this.http.delete(this.uri+id);
  }

  postAnswer(challenge: any, answer: any, url1: any, url2: any, timeLeft: number, hintUsed: boolean, comment: string) {
    const formattedAnswer = {
      user: this.authService.getUser(),
      challenge: challenge,
      studyId: this.authService.getUser().study,
      answers: [
        {
          answer: answer,
          urls: [
            {
              url: url1
            },
            {
              url: url2
            }
          ]
        }
      ],
      timeLeft: timeLeft,
      hintUsed: hintUsed,
      comment: comment
    }
    return this.http.post(this.uri + 'answer/', formattedAnswer, { headers: {'x-access-token': localStorage.getItem('auth_token')} });
  }

  lastUserAnswer(){
    return this.http.get(this.uri + 'answers/last', { headers: {'x-access-token': localStorage.getItem('auth_token')} });
  }
}
