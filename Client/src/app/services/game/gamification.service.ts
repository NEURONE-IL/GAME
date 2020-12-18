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
}
