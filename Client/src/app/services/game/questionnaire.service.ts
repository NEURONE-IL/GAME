import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EndpointsService } from '../endpoints/endpoints.service';
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
    return this.http.get(this.uri+'byType/'+type)
  }

  getQuestionnaire(id: string) {
    return this.http.get(this.uri+id);
  }

  postQuestionnaire(questionnaire: any): Observable<any> {
    /*Includes just the non empty properties and excludes the checked property used for validation*/
    let cleanQuestionnaire = Object.assign(new Object, questionnaire);
    delete cleanQuestionnaire.checked;
    /*Iterates through the object to remove the empty properties*/
    for (const property in cleanQuestionnaire) {
      if(cleanQuestionnaire[property] === ''){
        delete cleanQuestionnaire[property];
      }
    };
    /*Sends the request*/
    return this.http.post(this.uri, cleanQuestionnaire, { headers: {'x-access-token': localStorage.getItem('auth_token')} });
  }  

  postAnswers(user: any, questionnaire: any, questionnaireAnswers: any): Observable<any> {
    let answers = [];
    questionnaireAnswers.forEach((answer: number, index: number) => {
      let newAnswer = {
        question: questionnaire.questions[index].question,
        answer: answer,
        number: questionnaire.questions[index].number
      }
      answers.push(newAnswer);
    });
    let userQuestionnaire = {
      user: user._id,
      questionnaire: questionnaire._id,
      answers: answers
    };
    /*Sends the request*/
    console.log(userQuestionnaire)
    return this.http.post(this.uri+'answer', userQuestionnaire, { headers: {'x-access-token': localStorage.getItem('auth_token')} });
  }
}
