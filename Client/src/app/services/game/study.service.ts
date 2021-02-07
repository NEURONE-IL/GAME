import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EndpointsService } from '../endpoints/endpoints.service';
import { Observable } from 'rxjs';

export interface Study {
  _id: string,
  name: string,
  description: string,
  domain: string,
  gm_code: string,
  cooldown: number,
  createdAt: string,
  updatedAt: string
}

@Injectable({
  providedIn: 'root'
})
export class StudyService {

  uri = this.endpoints.rootURL + 'study/';

  constructor(protected http: HttpClient, private endpoints: EndpointsService) { }

  getStudies(): Observable<any> {
    return this.http.get(this.uri);
  }

  getStudy(id: string): Observable<any> {
    return this.http.get(this.uri+id);
  }

  getStudySignup(id: string): Observable<any> {
    return this.http.get(this.uri+id+'/getForSignup');
  }

  postStudy(study: any): Observable<any> {
    console.log(study)
    /*Iterates through the object to remove the empty properties*/
    for (const property in study) {
      if(!study[property] && property !== 'relevant' && study[property] !== 0){
        delete study[property];
      }
    }
    /*Sends the request*/
    return this.http.post(this.uri, study, { headers: {'x-access-token': localStorage.getItem('auth_token')} });
  }
}
