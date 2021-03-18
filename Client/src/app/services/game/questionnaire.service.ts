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

  postAnswers(user: any, questionnaire: any, questionnaireAnswers: any): Observable<any> {
    let answers = [];
    if(questionnaire.type='initial') {
      console.log(questionnaire.questions);
      let optionIndex = 0;
      questionnaire.questions.forEach((question, index) => {
        let newAnswer = {
          question: questionnaire.questions[index].question,
          answer: [],
          number: questionnaire.questions[index].number
        }
        question.options.forEach(() => {
          newAnswer.answer.push(questionnaireAnswers[optionIndex]);
          optionIndex++;
        });
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
    else {
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
}
