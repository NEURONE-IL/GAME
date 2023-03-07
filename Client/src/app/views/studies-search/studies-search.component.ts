import { Component, OnInit, ViewChild, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { StudiesSearchResultsComponent } from '../studies-search-results/studies-search-results.component';

@Component({
  selector: 'app-studies-search',
  templateUrl: './studies-search.component.html',
  styleUrls: ['./studies-search.component.css']
})
export class StudiesSearchComponent implements OnInit {
  search : string = "";

  resultsComponent: StudiesSearchResultsComponent;
  name: string;

  constructor( private router: Router, private injector:Injector) { }

  ngOnInit(): void {
    
  }
  onActivate(componentReference) {
      this.resultsComponent = componentReference;
 }

}
