import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { EndpointsService } from '../../services/endpoints/endpoints.service';

@Component({
  selector: 'app-view-page',
  templateUrl: './view-page.component.html',
  styleUrls: ['./view-page.component.css']
})
export class ViewPageComponent implements OnInit {

  constructor(private route: ActivatedRoute, private endpoints: EndpointsService) { }

  url: string;
  docUrl: string;
  title: string;

  ngOnInit(): void {
    this.route.paramMap
      .subscribe((params: ParamMap) => {
        this.url = params.get('url');
        this.title = params.get('title');
        this.docUrl = this.endpoints.neuroneURL + '/' + this.url;
        console.log(this.docUrl)
      });
  }

}
