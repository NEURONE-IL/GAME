import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GameService } from 'src/app/services/game/game.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  query: string;
  locale: string;
  task: string;
  domain: string;  
  constructor(public router: Router, public gameService: GameService) { }

  ngOnInit(): void {
    const challenge = this.gameService.challenge;
    this.locale = 'es-CL'; //Por el momento va hardcodeado
    this.task = challenge._id;
    this.domain = challenge.study;
  }

  search(){
    if(this.query !== ''){
      //this.router.navigate(['session/search-result', this.query, this.locale, this.task, this.domain]);
      this.router.navigate(['session/search-result', this.query, this.locale, '5fea701ffeab9b3e4f5df584', '5fea6fa4feab9b3e4f5df574']);
    }
  }

}
