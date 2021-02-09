import { Component, OnInit} from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { EndpointsService } from 'src/app/services/endpoints/endpoints.service';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.css']
})
export class SearchResultComponent implements OnInit {

  query: string;
  locale: string;
  domain: string;
  documents = [];
  searching: boolean;
  BaseUrl = "http://159.65.100.191:3000/";
  constructor(protected endpointsService: EndpointsService, private route: ActivatedRoute, public router: Router ) { }

  ngOnInit(): void {
    this.searching = true;
    this.route.paramMap
      .subscribe((params: ParamMap) => {
        this.query = params.get('query');
        this.locale = params.get('locale');
        this.domain = params.get('domain');
      });
    this.endpointsService.getDocuments(this.query, this.locale, this.domain)
      .subscribe((data: []) => { // Success
        this.documents = data;
        this.searching = false;
      },
      (error) => {
        console.error(error);
      });
  }

  search(){
    if (this.query !== ''){
      this.router.navigateByUrl('/',{skipLocationChange: true}).then(
        () => this.router.navigate(['session/search-result', this.query, this.locale, this.domain]));
    }
  }

}
