import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { GameService } from '../../services/game/game.service';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.css']
})
export class StartComponent implements OnInit {

  stage: string;
  loading = true;
  gameActive: boolean;

  gameDataSubscription: Subscription;

  constructor(public router: Router, private gameService: GameService) {
  }

  ngOnInit(): void {
    this.gameService.init();
    if (!this.gameService.loading) {
      console.log('not loading!!');
      this.loadData();
    }
    this.gameDataSubscription =
    this.gameService.gameDataChange.subscribe(() => {
      console.log('subscription triggered!');
      this.loadData();
    });
  }

  loadData() {
    this.stage = this.gameService.stage;
    this.loading = this.gameService.loading;
    this.gameActive = this.gameService.gameActive;
    console.log('navigating from start to ' + this.stage);
    this.router.navigate(['start', this.stage]);
  }

  test() {
    console.log(this.gameService.getStage());
  }

  ngOnDestroy() {
    this.gameDataSubscription.unsubscribe();
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
