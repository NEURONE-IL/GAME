import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StudyResourcesService {

  uriCompetences = environment.apiURL + 'competence/';
  uriLangages = environment.apiURL + 'language/';
  constructor(protected http: HttpClient) { }

  getCompetences(): Observable<any>{
    return this.http.get(this.uriCompetences);
  }
  getLanguages(): Observable<any>{
    return this.http.get(this.uriLangages);
  }
}
