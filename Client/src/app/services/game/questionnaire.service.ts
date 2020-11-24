import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EndpointsService } from '../endpoints/endpoints.service';
import Axios from 'axios';
import { Observable } from 'rxjs';

export interface Questionnaire {
  _id: string,
  name: string,
  type: string,
  questions: [any],
  createdAt: string,
  updatedAt: string
}

@Injectable({
  providedIn: 'root'
})
export class QuestionnaireService {

  uri = this.endpoints.rootURL + 'questionnaire/';

  constructor(protected http: HttpClient, private endpoints: EndpointsService) { }

  getQuestionnaires(): Observable<any> {
    return this.http.get(this.uri);
  }

  getQuestionnairesByType(type: string): Observable<any> {
    console.log('http://localhost:3090/api/questionnaire/byType/'+type)
    return this.http.get('http://localhost:3090/api/questionnaire/byType/'+type)
  }

  getQuestionnaire(id: string) {
    return this.http.get(this.uri+id);
  }

  async postQuestionnaire(questionnaire: any) {
    /*Includes just the non empty properties and excludes the checked property used for validation*/
    let cleanQuestionnaire = Object.assign(new Object, questionnaire);
    delete cleanQuestionnaire.checked;
    /*Iterates through the object to remove the empty properties*/
    for (const property in cleanQuestionnaire) {
      if(cleanQuestionnaire[property] === ''){
        delete cleanQuestionnaire[property];
      }
    }
    /*Sends the request using Axios*/    
    await Axios
    .post('http://localhost:3090/api/questionnaire', cleanQuestionnaire, { headers: {'x-access-token': localStorage.getItem('auth_token')} })
    .then( response => {
      console.log(response.data)
    })
    .catch(error => {
      console.log(error);
    })
  }  
}
