import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.css']
})
export class SearchResultComponent implements OnInit {

  query: string;
  documents = [{url:'xd', title: 'hola', indexedBody:'asdasdasd'},{url:'xd', title: 'hola', indexedBody:'asdasdasd'}];
  constructor() { }

  ngOnInit(): void {
    console.log(this.documents)
  }

}
