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

  postStudy(study: any): Observable<any> {
    console.log(study)
    /*Includes just the non empty properties and excludes the checked property used for validation*/
    let cleanStudy = Object.assign(new Object, study);
    delete cleanStudy.checked;
    /*Iterates through the object to remove the empty properties*/
    for (const property in cleanStudy) {
      if(!cleanStudy[property] && property !== 'relevant' && cleanStudy[property] !== 0){
        delete cleanStudy[property];
      }
    }
    /*Sends the request*/
    return this.http.post(this.uri, cleanStudy, { headers: {'x-access-token': localStorage.getItem('auth_token')} });
  }
}
