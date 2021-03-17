import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StoreSessionService {

  sessionLogUri = environment.apiURL + 'sessionLog'

  constructor(private http: HttpClient) { }

  // Save session logs
  postSessionLog(data) {
    this.http.post(this.sessionLogUri, data)
    .subscribe((resp: any) => {
      },
      (error) => {
        console.log(error);
      }
      );
  }
}
