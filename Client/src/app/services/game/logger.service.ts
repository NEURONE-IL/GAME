import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EndpointsService } from '../endpoints/endpoints.service';

@Injectable({
  providedIn: 'root'
})
export class LoggerService {

  uri = this.endpoints.rootURL + 'sessionLog/';

  constructor(protected http: HttpClient, private endpoints: EndpointsService) { }

  // Get all studies
  postSessionLog(newSessionLog) {
    return this.http.post(this.uri, newSessionLog);
  }

}
