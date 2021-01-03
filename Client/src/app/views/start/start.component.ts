import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GameService } from '../../services/game/game.service';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.css']
})
export class StartComponent implements OnInit {

  loading = true;

  constructor(public router: Router, public gameService: GameService) {
  }

  async ngOnInit(): Promise<void> {
    await this.gameService.load().then(() => {
      if (!this.gameService.loading) {
        this.loading = false;
      }
    });
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
    this.gameService.challengeStarted();
  }
}
