import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

export interface Study {
  _id: string,
  name: string,
  description: string,
  domain: string,
  gm_code: string,
  cooldown: number,
  createdAt: string,
  updatedAt: string,
  image_id: string,
  image_url: string,
  max_per_interval: number
}

@Injectable({
  providedIn: 'root'
})
export class StudyService {

  uri = environment.apiURL + 'study/';

  constructor(protected http: HttpClient) { }

  getStudies(): Observable<any> {
    return this.http.get(this.uri);
  }

  getStudy(id: string): Observable<any> {
    return this.http.get(this.uri+id);
  }

  getStudyUserStats(id: string): Observable<any> {
    return this.http.get(this.uri+id+'/stats');
  }

  getStudySignup(id: string): Observable<any> {
    return this.http.get(this.uri+id+'/getForSignup');
  }

  deleteStudy(id: string): Observable<any> {
    return this.http.delete(this.uri+id);
  }

  postStudy(study: any): Observable<any> {
    console.log(study)
    for (var value of study.entries()) {
      console.log(value[0]+ ', ' + value[1]);
    }
    /*Sends the request*/
    return this.http.post(this.uri, study, { headers: {'x-access-token': localStorage.getItem('auth_token')} });
  }

  putStudy(studyId: string, updatedStudy: any): Observable<any> {
    /*
    for (var value of updatedStudy.entries()) {
      console.log(value[0]+ ', ' + value[1]);
    }
    */
    /*Sends the request*/
    return this.http.put(this.uri+studyId, updatedStudy, { headers: {'x-access-token': localStorage.getItem('auth_token')} });
  }
}
