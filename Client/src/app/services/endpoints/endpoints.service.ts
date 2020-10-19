import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EndpointsService {
  
  rootURL = 'http://localhost:3080/api/';
  neuroneURL = 'http://localhost:3000'

  constructor(protected http: HttpClient) { }

  /* DOCUMENT RETRIEVER */
  getDocuments(query, locale, task, domain){
    const post = {query: query, locale: locale, task: task, domain: domain};
    console.log(post)
    return this.http.post(this.neuroneURL+'/v1/document/search', post);
  }

  /* QUESTIONS */
  getQuestions(){
    return this.http.get(this.rootURL + '/questions');
  }
}
