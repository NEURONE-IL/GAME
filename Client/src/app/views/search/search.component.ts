import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  query: string;
  constructor(public router: Router) { }

  ngOnInit(): void {

  }

  search(){
    this.router.navigate(['start/search-result']);
  }

}
