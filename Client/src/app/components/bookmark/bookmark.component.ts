import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-bookmark',
  templateUrl: './bookmark.component.html',
  styleUrls: ['./bookmark.component.css']
})
export class BookmarkComponent implements OnInit {

  favorite: boolean;

  constructor() { }

  ngOnInit(): void {
    this.favorite = false;
  }

  debug(){
    this.favorite = !this.favorite;
    console.log('nice');
  }
}
