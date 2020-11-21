import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { EndpointsService } from 'src/app/services/endpoints/endpoints.service';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.css']
})
export class SearchResultComponent implements OnInit {

  query: string;
  documents = [];
  constructor(protected endpointsService: EndpointsService, private route: ActivatedRoute, public router: Router ) { }

  ngOnInit(): void {
    this.route.paramMap
      .subscribe((params: ParamMap) => {
        this.query = params.get('query');
      });
    this.endpointsService.getDocuments(this.query, "es-CL", "task1", "domain1").subscribe((data: []) => { // Success

      this.documents = data;
    },
    (error) => {
      console.error(error);
    });
  }

  search(){
    if(this.query !== ''){
      this.router.navigate(['session/search-result', this.query]);
    }
  }

}
