import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GameService } from '../../services/game/game.service';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.css']
})
export class StartComponent implements OnInit {

  constructor(public router: Router, public gameService: GameService) {
  }

  async ngOnInit(): Promise<void> {
    await this.gameService.load();
    if (!this.gameService.loading) {
      console.log('not loading!!');
    }
  }

  test() {
    console.log(this.gameService.stage);
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
    this.gameService.stage = 'gameplay';
    this.gameService.updateUserProgress('gameplay');
    this.router.navigate(['session/search']);

  }
}
