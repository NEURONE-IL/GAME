import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GameService } from 'src/app/services/game/game.service';
import { StoreQueryService } from 'src/app/services/logger/store-query.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
})
export class SearchComponent implements OnInit {
  query: string;
  locale: string;
  domain: string;
  constructor(
    public router: Router,
    public gameService: GameService,
    private storeQueryService: StoreQueryService
  ) {}

  ngOnInit(): void {
    const challenge = this.gameService.challenge;
    this.locale = environment.locale; //Por el momento va hardcodeado
    this.domain = challenge.study;
  }

  search() {
    if (this.query !== '' && this.query!== '*') {
      let queryData = {
        query: this.query,
        title: document.title,
        url: this.router.url,
        localTimeStamp: Date.now(),
        localTimeStampNumber: Date.now()
      };
      this.storeQueryService.postQuery(queryData);
      this.router.navigate([
        'session/search-result',
        this.query,
        this.domain
      ]);
    }
  }
}
