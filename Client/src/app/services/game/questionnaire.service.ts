import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
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

  uri = environment.apiURL + 'questionnaire/';

  constructor(protected http: HttpClient) { }

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
    /*Iterates through the object to remove the empty properties*/
    for (const property in questionnaire) {
      if(questionnaire[property] === ''){
        delete questionnaire[property];
      }
    };
    /*Sends the request*/
    return this.http.post(this.uri, questionnaire, { headers: {'x-access-token': localStorage.getItem('auth_token')} });
  }

  postAnswers(user: any, questionnaire: any, questionnaireAnswers: any, challenge: any, type: string): Observable<any> {
    let answers = [];
      questionnaireAnswers.forEach((answer: number, index: number) => {
        let newAnswer = {
          question: questionnaire[0].questions[index].question,
          answer: answer,
          number: questionnaire[0].questions[index].number
        }
        answers.push(newAnswer);
      });
      let userQuestionnaire = {
        user: user._id,
        questionnaire: questionnaire[0]._id,
        challenge: challenge._id,
        type: type,
        answers: answers
      };
      /*Sends the request*/
      return this.http.post(this.uri+'answer', userQuestionnaire, { headers: {'x-access-token': localStorage.getItem('auth_token')} });
  }
}
