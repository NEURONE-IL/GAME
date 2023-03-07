import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

import { Study } from 'src/app/services/game/study.service';
import { User, AuthService} from 'src/app/services/auth/auth.service';

export interface Invitation{
  _id: string,
  user: User,
  study: Study,
  status: string,
  createdAt: string,
  updatedAt: string
}

@Injectable({
  providedIn: 'root'
})
export class InvitationService {
  uri = environment.apiURL + 'invitation/';

  constructor( protected http: HttpClient, private authService: AuthService ) { }

  getInvitationByUser(user_id: string): Observable<any>{
    return this.http.get(this.uri +'byUser/'+user_id);
  }
  checkExistingInvitation(user_id: string, study_id: string): Observable<any>{
    return this.http.get(this.uri +'checkExist/'+user_id+'/'+study_id);
  }

  acceptInvitation(invitation: Invitation, type: string): Observable<any>{
    return this.http.put(this.uri + 'acceptInvitation/'+type, invitation, { headers: {'x-access-token': localStorage.getItem('auth_token')} })
  }
  rejectInvitation(invitation: Invitation, type: string): Observable<any>{
    return this.http.put(this.uri + 'rejectInvitation/'+type, invitation, { headers: {'x-access-token': localStorage.getItem('auth_token')} })
  }
  requestCollab(invitation: any): Observable<any>{
    return this.http.post(this.uri + 'requestCollaboration/', invitation, { headers: {'x-access-token': localStorage.getItem('auth_token')} })
  }
}
