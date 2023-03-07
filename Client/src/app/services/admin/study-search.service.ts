import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Study } from '../game/study.service';

export interface StudySearch{
  _id: string,
  study: Study,
  name: string,
  description: string,
  challenges: string[],
  createdAt: string,
  updatedAt: string
}
@Injectable({
  providedIn: 'root'
})
export class StudySearchService {
  uri = environment.apiURL + 'studySearch/';
  
  constructor(protected http: HttpClient) { }

  searchStudies(user_id: string, query: string, page: number, filters:any): Observable<any>{
    return this.http.post(this.uri +'search/'+user_id+'/'+query+'/'+page, filters);
  }
}
