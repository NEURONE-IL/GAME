import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { EndpointsService } from '../endpoints/endpoints.service';

@Injectable({
  providedIn: 'root'
})
export class StoreLinkService {

  visitedLinkUri = this.endpoints.rootURL + 'visitedLink'

  constructor(private http: HttpClient, private endpoints: EndpointsService, private authService: AuthService) { }

  // Save session logs
  postVisitedLink(data) {
    if(this.authService.loggedIn){
      data.userId = this.authService.getUser()._id;
      this.http.post(this.visitedLinkUri, data)
      .subscribe((resp: any) => {
        },
        (error) => {
          console.log(error);
        }
        );
    }
  }
}
