import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

import { Study } from 'src/app/services/game/study.service';
import { User, AuthService} from 'src/app/services/auth/auth.service';

export interface History{
  _id: string,
  user: User,
  study: Study,
  description: string,
  createdAt: string,
  updatedAt: string
}

@Injectable({
  providedIn: 'root'
})
export class HistoryService {

  uri = environment.apiURL + 'history/';
  constructor( protected http: HttpClient, private authService: AuthService ) { }

  getHistoryByUser(user_id: string): Observable<any>{
    return this.http.get(this.uri +'byUser/'+user_id);
  }

  getHistoryByUserByType(user_id: string, type: string): Observable<any>{
    return this.http.get(this.uri +'byUserByType/'+user_id+'/'+type);
  }

  getHistoryByStudy(study_id: string): Observable<any>{
    return this.http.get(this.uri +'byStudy/'+study_id);
  }

  getHistoryByStudyByType(study_id: string, type: string): Observable<any>{
    return this.http.get(this.uri +'byStudyByType/'+study_id+'/'+type);
  }
}
