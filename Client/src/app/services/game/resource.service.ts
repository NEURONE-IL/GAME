import { Injectable } from '@angular/core';
import { EndpointsService } from '../endpoints/endpoints.service';

@Injectable({
  providedIn: 'root'
})
export class ResourceService {

  uri = this.endpoints.rootURL + 'document/';

  constructor(private endpoints: EndpointsService) { }

}