import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import {User, AuthService} from 'src/app/services/auth/auth.service';

export interface Study {
  _id: string,
  name: string,
  description: string,
  domain: string,
  privacy: boolean,
  user: User,
  collaborators: Collaborators[],
  tags: string[],
  gm_code: string,
  cooldown: number,
  createdAt: string,
  updatedAt: string,
  image_id: string,
  image_url: string,
  max_per_interval: number,

  levels: any,
  competences: any,
  language: any
}
export interface Collaborators {
  user: User,
  invitation: string
}

@Injectable({
  providedIn: 'root'
})
export class StudyService {

  uri = environment.apiURL + 'study/';
  eventSource : EventSource;

  constructor(protected http: HttpClient, private authService: AuthService, private _zone: NgZone) { }

  getStudies(): Observable<any> {
    return this.http.get(this.uri);
  }

  getStudy(id: string): Observable<any> {
    return this.http.get(this.uri+id);
  }
  getStudiesByUser(userId: string): Observable<any> {
    return this.http.get(this.uri +'byUser/'+userId)
  }
  getStudiesByUserCollaboration(userId: string): Observable<any> {
    return this.http.get(this.uri +'byUserCollaboration/'+userId)
  }
  //Se obtienen los estudios filtrados según privacidad
  getStudiesByUserByPrivacy(params: any): Observable<any> {
    return this.http.get(this.uri +'byUserbyPrivacy/'+params.user+'/'+params.privacy)
  }
  getStudiesByUserByType(params: any): Observable<any> {
    return this.http.get(this.uri +'byUserbyType/'+params.user+'/'+params.type)
  }

  getStudyUserStats(id: string): Observable<any> {
    return this.http.get(this.uri+id+'/stats');
  }

  getStudySignup(id: string): Observable<any> {
    return this.http.get(this.uri+id+'/getForSignup');
  }
  copyStudy(study_id: string, user_id: string): Observable<any>{
    return this.http.get(this.uri+'copy/'+study_id+'/user/'+user_id)
  }

  deleteStudy(id: string): Observable<any> {
    return this.http.delete(this.uri+id);
  }

  postStudy(study: any): Observable<any> {
    console.log(study)
    /*for (var value of study.entries()) {
      console.log(value[0]+ ', ' + value[1]);
    }*/
    /*Sends the request*/
    return this.http.post(this.uri, study, { headers: {'x-access-token': localStorage.getItem('auth_token')} });
  }
  
  putStudy(studyId: string, updatedStudy: any): Observable<any> {
    return this.http.put(this.uri+studyId, updatedStudy, { headers: {'x-access-token': localStorage.getItem('auth_token')} });
  }
  requestForEdit(studyId: string, user: any): Observable<any> {
    return this.http.put(this.uri+'requestEdit/'+studyId, user, { headers: {'x-access-token': localStorage.getItem('auth_token')} });
  }
  releaseForEdit(studyId: string, user: any): Observable<any> {
    return this.http.put(this.uri+'releaseStudy/'+studyId, user, { headers: {'x-access-token': localStorage.getItem('auth_token')} });
  }
  editCollaboratorStudy(studyId: string, collaborators: any): Observable<any> {
    let reqBody = {collaborators: collaborators}
    return this.http.put(this.uri+'editCollaborator/'+studyId, reqBody, { headers: {'x-access-token': localStorage.getItem('auth_token')} });
  }

  getAssistant(studyId: string){
    return this.http.get(this.uri+studyId+'/assistant');
  }

  // Control de concurrencia
  getServerSentEvent(study_id: string,user_id: string): Observable<any> {
    return new Observable((observer) => {

      this.eventSource = this.getEventSource(study_id,user_id);
      this.eventSource.onmessage = event => {
        this._zone.run(() => {
          observer.next(event);
        });
      };
      this.eventSource.onerror = error => {
        this._zone.run(() => {
          observer.error(error);
        });
      };
    });
  }
  closeEventSource(): void{
    if(!(this.eventSource == undefined)){
      this.eventSource.close();
    }
  }

  getEventSource(study_id: string, user_id: string): EventSource {
    this.eventSource = null;
    return new EventSource(this.uri+'editStatus/'+study_id+'/'+user_id);
  }
}
