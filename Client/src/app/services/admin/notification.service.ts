import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

import { Study } from 'src/app/services/game/study.service';
import { User, AuthService} from 'src/app/services/auth/auth.service';
import { Invitation} from 'src/app/services/admin/invitation.service';
import { History} from 'src/app/services/admin/history.service';

export interface Notification{
  _id: string,
  user: User,
  type: string,
  invitation: Invitation,
  history: History,
  description: string,
  seen: boolean,
  createdAt: string,
  updatedAt: string
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  uri = environment.apiURL + 'adminNotification/';

  constructor( protected http: HttpClient, private authService: AuthService ) { }

  getNotificationByUser(user_id: string): Observable<any>{
    return this.http.get(this.uri +'byUser/'+user_id);
  }
  seeNotification(notification: Notification): Observable<any>{
    return this.http.put(this.uri + 'seeNotifications/', notification, { headers: {'x-access-token': localStorage.getItem('auth_token')} })
  }
}
