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
  screenHeight: any;
  documents = [];
  BaseUrl = "http://159.65.100.191:3000/";

  constructor(protected endpointsService: EndpointsService, private route: ActivatedRoute, public router: Router ) { }

  ngOnInit(): void {
    this.screenHeight = window.innerHeight;
    this.search();
  }

  search(){
    this.endpointsService.getDocuments(this.query, this.locale, this.domain)
      .subscribe((data: []) => { // Success
          this.documents = data;
          this.endpointsService.sort(this.documents, "task1");
        },
        (error) => {
          console.error(error);
        });
  }



  getParameterByName(url, name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    let regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
      results = regex.exec(url);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
  }

  getThumbnail(youtubeUrl){
    let thumb = this.getParameterByName(youtubeUrl, 'v');
    let thumbUrl= 'http://img.youtube.com/vi/' + thumb + '/default.jpg';
    return thumbUrl;
  }

}
