import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EndpointsService } from '../endpoints/endpoints.service';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class StoreTrackService {

  mouseClickUri = this.endpoints.rootURL + 'mouseClick';
  mouseCoordinateUri = this.endpoints.rootURL + 'mouseCoordinate';
  // scrollUri = this.endpoints.rootURL + 'scroll';
  keyStrokeUri = this.endpoints.rootURL + 'keystroke';

  constructor(private http: HttpClient, private endpoints: EndpointsService, private authService: AuthService) { }

  // Save mouse clicks
  postMouseClick(data) {
    data.userId = this.authService.getUser()._id;
    this.http.post(this.mouseClickUri, data)
    .subscribe((resp: any) => {
      },
      (error) => {
        console.log(error);
      }
      );
  }

  // Save mouse coordinates
  postMouseCoordinates(data) {
    data.userId = this.authService.getUser()._id;
    this.http.post(this.mouseCoordinateUri, data)
    .subscribe((resp: any) => {
      },
      (error) => {
        console.log(error);
      }
      );
  }

  // Save keystrokes
  postKeyStroke(data) {
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
