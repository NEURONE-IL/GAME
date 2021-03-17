import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StoreLinkService {

  visitedLinkUri = environment.apiURL + 'visitedLink'

  constructor(private http: HttpClient, private authService: AuthService) { }

  // Save visited link
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
