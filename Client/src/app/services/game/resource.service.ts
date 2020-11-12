import { Injectable } from '@angular/core';
import { EndpointsService } from '../endpoints/endpoints.service';
import Axios from 'axios';

@Injectable({
  providedIn: 'root'
})
export class ResourceService {

  uri = this.endpoints.rootURL + 'document/';

  constructor(private endpoints: EndpointsService) { }

  // Get all resources
  async getResources() {
    await Axios
    .get(this.uri)
    .then(response => {
      console.log(response.data)
    })
    .catch(error =>{
      console.log(error.response)
    });
  }

  async postResource(resource: any) {
    /*Includes just the non empty properties and excludes the checked property used for validation*/
    let cleanResource = Object.assign(new Object, resource);
    delete cleanResource.checked;
    /*Iterates through the object to remove the empty properties*/
    for (const property in cleanResource) {
      if(cleanResource[property] === ''){
        delete cleanResource[property];
      }
    }
    /*Sends the request using Axios*/
    await Axios
    .post('http://localhost:3090/api/document', cleanResource, { headers: {'x-access-token': localStorage.getItem('auth_token')} })
    .then( response => {
      console.log(response.data)
    })
    .catch(error => {
      console.log(error);
    })
  }
}