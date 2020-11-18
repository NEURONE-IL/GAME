import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EndpointsService } from '../endpoints/endpoints.service';
import Axios from 'axios';
import { Observable } from 'rxjs';

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

  constructor(protected http: HttpClient, private endpoints: EndpointsService) { }

  getChallenges(): Observable<any> {
    return this.http.get(this.uri);
  }

  getChallengesByStudy(studyId: string): Observable<any> {
    return this.http.get('http://localhost:3090/api/challenge/byStudy/'+studyId)
  }

  getChallenge(id: string) {
    return this.http.get(this.uri+id);
  }

  async postChallenge(challenge: any) {
    /*Includes just the non empty properties and excludes the checked property used for validation*/
    let cleanChallenge = Object.assign(new Object, challenge);
    delete cleanChallenge.checked;
    /*Iterates through the object to remove the empty properties*/
    for (const property in cleanChallenge) {
      if(cleanChallenge[property] === ''){
        delete cleanChallenge[property];
      }
    }
    /*Sends the request using Axios*/    
    await Axios
    .post('http://localhost:3090/api/challenge', cleanChallenge, { headers: {'x-access-token': localStorage.getItem('auth_token')} })
    .then( response => {
      console.log(response.data)
    })
    .catch(error => {
      console.log(error);
    })
  }  
}
