import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GameService } from '../../services/game/game.service';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.css']
})
export class StartComponent implements OnInit {

  stage: string;
  loading: boolean;

  constructor(public router: Router, private gameService: GameService) {
  }

  ngOnInit(): void {
    this.gameService.gameDataChange.subscribe(() => {
      console.log('gameData updated');
      this.loadData();
    });
  }

  loadData() {
    this.stage = this.gameService.stage;
    this.loading = this.gameService.loading;
    console.log(this.stage, this.loading);
    console.log(this);
    this.router.navigate(['start', this.gameService.stage]);
  }

  test() {
    console.log(this);
    console.log(this.stage);
    console.log(this.loading);
  }
}

@Component({
  selector: 'app-start-instructions',
  templateUrl: './instructions.html',
  styleUrls: ['./start.component.css']
})
export class StartInstructionsComponent {

  constructor(public router: Router, private gameService: GameService) {}

  doStart(){
    this.gameService.setStage('gameplay');
    this.router.navigate(['session/search']);

  }
}
