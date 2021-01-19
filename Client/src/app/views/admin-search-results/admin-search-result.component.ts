import { Component, OnInit, Input} from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { EndpointsService } from 'src/app/services/endpoints/endpoints.service';

let input = Input;

@Component({
  selector: 'app-admin-search-result',
  templateUrl: './admin-search-result.component.html',
  styleUrls: ['./admin-search-result.component.css']
})
export class AdminSearchResultComponent implements OnInit {

  @Input() query: string;
  locale: string;
  @Input() domain: string;

  documents = [];

  constructor(protected endpointsService: EndpointsService, private route: ActivatedRoute, public router: Router ) { }

  ngOnInit(): void {
    this.search();
  }

  search(){
    this.endpointsService.getDocuments(this.query, this.locale, this.domain)
      .subscribe((data: []) => { // Success
          this.documents = data;
        },
        (error) => {
          console.error(error);
        });
  }

}
