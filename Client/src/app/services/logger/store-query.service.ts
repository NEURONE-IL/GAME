import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { EndpointsService } from '../endpoints/endpoints.service';

@Injectable({
  providedIn: 'root'
})
export class StoreQueryService {

  queryUri = this.endpoints.rootURL + 'query'

  constructor(private http: HttpClient, private endpoints: EndpointsService, private authService: AuthService) { }

  // Save query
  postQuery(data) {
    if(this.authService.loggedIn){
      data.userId = this.authService.getUser()._id;
      data.userEmail = this.authService.getUser().email;
      this.http.post(this.queryUri, data)
      .subscribe((resp: any) => {
        },
        (error) => {
          console.log(error);
        }
        );
    }
  }
}
