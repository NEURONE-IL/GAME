import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EndpointsService } from '../endpoints/endpoints.service';

@Injectable({
  providedIn: 'root'
})
export class GamificationService {

  uri = this.endpoints.rootURL;

  constructor(protected http: HttpClient, private endpoints: EndpointsService) { }

  gamificationStatus(): Observable<any> {
    return this.http.get(this.uri+'gamification/isGamified');
  }

  gamify(): Observable<any> {
    return this.http.get(this.uri+'gamification/gamify');
  }

  gamifyDependent(): Observable<any> {
    return this.http.get(this.uri+'gamification/gamifyDependent');
  }

  userLevel(user_id): Observable<any> {
    return this.http.get(this.uri+'gamification/userLevels/'+user_id );
  }

  userLevelProgress(user_id): Observable<any> {
    return this.http.get(this.uri+'gamification/userLevelProgress/'+user_id );
  }

  userCompletedChallenges(user_id): Observable<any> {
    return this.http.get(this.uri+'gamification/userChallenges/'+user_id );
  }

  userPoints(user_id): Observable<any>{
    return this.http.get(this.uri+'gamification/userPoints/'+user_id );
  }
}
