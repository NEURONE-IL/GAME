import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EndpointsService } from '../endpoints/endpoints.service';

@Injectable({
  providedIn: 'root'
})
export class StudiesService {

  uri = this.endpoints.rootURL + 'study/';

  constructor(protected http: HttpClient, private endpoints: EndpointsService) { }

  // Get all studies
  getStudies() {
    return this.http.get(this.uri);
  }

  getStudy(id: string) {
    return this.http.get(this.uri+id);
  }

}
