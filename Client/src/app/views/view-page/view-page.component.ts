import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-view-page',
  templateUrl: './view-page.component.html',
  styleUrls: ['./view-page.component.css']
})
export class ViewPageComponent implements OnInit {

  constructor(private route: ActivatedRoute) { }

  url: string;
  docUrl: string;
  ngOnInit(): void {
    this.route.paramMap
      .subscribe((params: ParamMap) => {
        this.url = params.get('url');
        console.log(this.url);
        this.docUrl = 'http://localhost:3000/'+this.url;
        console.log(this.docUrl)
      });
  }

}
