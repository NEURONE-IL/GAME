import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EndpointsService {

  rootURL = 'http://159.65.100.191:3030/api/';
//  rootURL = 'http://localhost:3090/api/';
//  neuroneURL = 'http://localhost:3000';
  frontURL = 'http://159.65.100.191:4200';
  neuroneURL = 'http://159.65.100.191:3000';

  constructor(protected http: HttpClient) { }

  /* DOCUMENT RETRIEVER */
  getDocuments(query, locale, domain){
    const post = JSON.stringify({query: query, locale: locale, domain: domain});
    let header = new HttpHeaders();
    header = header.append('Content-Type', 'text/plain');
    return this.http.post(this.neuroneURL+'/v1/document/search', post, {headers: header});
  }

  pingNeurone(){
    return this.http.get(this.neuroneURL+'/v1/ping');
  }

  /*uploadDocument*/
  loadDocument(resource: any){
    let cleanResource = Object.assign(new Object, resource);
    delete cleanResource.checked;
    delete cleanResource.type;
    cleanResource.domain = cleanResource.domain.split();
    cleanResource.task = cleanResource.task.split();
    let header = new HttpHeaders();
    header= header.append('Content-Type', 'text/plain');
    return this.http.post(this.neuroneURL+'/v1/document/load', cleanResource, {headers: header});
  }

  /* QUESTIONS */
  getQuestions(){
    return this.http.get(this.rootURL + '/questions');
  }
}
