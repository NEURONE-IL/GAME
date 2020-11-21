import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EndpointsService {
  
  rootURL = 'http://localhost:3090/api/';
  neuroneURL = 'http://localhost:3000'

  constructor(protected http: HttpClient) { }

  /* DOCUMENT RETRIEVER */
  getDocuments(query, locale, task, domain){
    const post = JSON.stringify({query: query, locale: locale, task: task, domain: domain});
    let header = new HttpHeaders();
    header= header.append('Content-Type', 'text/plain');
    return this.http.post(this.neuroneURL+'/v1/document/search', post, {headers: header});
  }

  pingNeurone(){
    return this.http.get(this.neuroneURL+'/v1/ping');
  }

  loadDocument(document){
    let header = new HttpHeaders();
    header= header.append('Content-Type', 'text/plain');
    return this.http.post(this.neuroneURL+'/v1/document/load', document, {headers: header});
  }

  /* QUESTIONS */
  getQuestions(){
    return this.http.get(this.rootURL + '/questions');
  }
}
