import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class StoreTrackService {

  mouseClickUri = environment.apiURL + 'mouseClick';
  mouseCoordinateUri = environment.apiURL + 'mouseCoordinate';
  scrollUri = environment.apiURL + 'scroll';
  keyStrokeUri = environment.apiURL + 'keystroke';
  eventUri = environment.apiURL + 'event';

  constructor(private http: HttpClient, private authService: AuthService) { }

  // Save mouse clicks
  postMouseClick(data) {
    if(this.authService.loggedIn){
      data.userId = this.authService.getUser()._id;
      this.http.post(this.mouseClickUri, data)
      .subscribe((resp: any) => {
        },
        (error) => {
          console.log(error);
        }
        );
    }
  }


  // Save mouse coordinates
  postMouseCoordinates(data) {
    if(this.authService.loggedIn){
      let user = this.authService.getUser();
      data.userId = user._id;
      data.userEmail = user.email;
      this.http.post(this.mouseCoordinateUri, data)
      .subscribe((resp: any) => {
        },
        (error) => {
          console.log(error);
        }
        );
    }
  }

  // Save scrolls
  postScroll(data) {
    if(this.authService.loggedIn){
      let user = this.authService.getUser();
      data.userId = user._id;
      data.userEmail = user.email;
      this.http.post(this.scrollUri, data)
      .subscribe((resp: any) => {
        },
        (error) => {
          console.log(error);
        }
        );
    }
  }

  // Save keystrokes
  postKeyStroke(data) {
    if(this.authService.loggedIn){
      data.userId = this.authService.getUser()._id;
      this.http.post(this.keyStrokeUri, data)
      .subscribe((resp: any) => {
        },
        (error) => {
          console.log(error);
        }
        );
      }
  }

  // Save modalEvents
  postHelpModalEvent(data){
    if(this.authService.loggedIn){
      data.userId = this.authService.getUser()._id;
      this.http.post(this.eventUri, data)
      .subscribe((resp: any) => {
        },
        (error) => {
          console.log(error);
        }
        );
      }    
  }

}
