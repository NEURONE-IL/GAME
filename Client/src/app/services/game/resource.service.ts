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
    /*Includes just the NEURONE required properties*/
    let cleanResource = Object.assign(new Object, resource);
    delete cleanResource.checked;
//    delete cleanResource.keywords;
//    delete cleanResource.searchSnippet;
//    delete cleanResource.relevant;
//    delete cleanResource.maskedURL;
    /*NEURONE required*/
    cleanResource.domain = cleanResource.domain.split();
    cleanResource.task = cleanResource.task.split();
    console.log(cleanResource, 'clean');
    /*Sends the request using Axios*/
    await Axios  
    .post('http://localhost:3000/v1/document/load', cleanResource, { headers: {'x-access-token': localStorage.getItem('auth_token')} })
//    .post('http://localhost:3090/api/document', cleanResource, { headers: {'x-access-token': localStorage.getItem('auth_token')} })
    .then( response => {
      console.log(response.data)
    })
    .catch(error => {
      console.log(error);
    })
  }
}