import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EndpointsService } from '../endpoints/endpoints.service';

@Injectable({
  providedIn: 'root'
})
export class StoreSessionService {

  sessionLogUri = this.endpoints.rootURL + 'sessionLog'

  constructor(private http: HttpClient, private endpoints: EndpointsService) { }

  // Save session logs
  postSessionLog(data) {
    this.http.post(this.sessionLogUri, data)
    .subscribe((resp: any) => {
      console.log(resp);
      },
      (error) => {
        console.log(error);
      }
      );
  }
}
