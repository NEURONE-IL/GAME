import { Injectable } from '@angular/core';
import { EndpointsService } from '../endpoints/endpoints.service';
import Axios from 'axios';

@Injectable({
  providedIn: 'root'
})
export class ChallengeService {

  uri = this.endpoints.rootURL + 'challenge/';

  constructor(private endpoints: EndpointsService) { }

  // Get all challenges
  async getChallenges() {
    await Axios
    .get(this.uri)
    .then(response => {
      console.log(response.data)
    })
    .catch(error =>{
      console.log(error.response)
    });
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
