import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

export interface Resource {
  _id: string,
  date: Date,
  docName: string,
  domain: [string],
  hash: string,
  keywords: [string],
  locale: string,
  relevant: boolean,
  route: string,
  searchSnippet: string,
  task: [string],
  title: string,
  type: string,
  url: string
}

@Injectable({
  providedIn: 'root'
})
export class EndpointsService {
  neuroneURL = environment.neuroneURL;

  constructor(protected http: HttpClient) { }

  /* DOCUMENT RETRIEVER */
  getDocuments(query, locale, domain){
    const post = JSON.stringify({query: query, locale: locale, domain: domain});
    let header = new HttpHeaders();
    header = header.append('Content-Type', 'text/plain');
    return this.http.post(this.neuroneURL+'v1/document/search', post, {headers: header});
  }

  /* SORT */
  sort(documents, task){
    if(task !== null){
      for(let i = 1; i < 2; i++){
        if(task === documents[i].task[0]){
          this.arraymove(documents, i, 0)
          break;
        }
      }
    }
    return documents;
  }

  pingNeurone(){
    return this.http.get(this.neuroneURL+'v1/ping');
  }

  /*uploadDocument*/
  loadDocument(resource: any){
    let cleanResource = Object.assign(new Object, resource);
    delete cleanResource.checked;
    cleanResource.domain = cleanResource.domain.split();
    cleanResource.task = cleanResource.task.split();
    let header = new HttpHeaders();
    header = header.append('Content-Type', 'text/plain');
    return this.http.post(this.neuroneURL+'v1/document/load', cleanResource, {headers: header});
  }

  deleteDocument(resource: any){
    let header = new HttpHeaders();
    header = header.append('Content-Type', 'text/plain');
    return this.http.post(this.neuroneURL+'v1/document/delete', resource, {headers: header});
  }

  arraymove(arr, fromIndex, toIndex) {
    var element = arr[fromIndex];
    arr.splice(fromIndex, 1);
    arr.splice(toIndex, 0, element);
  }
}
