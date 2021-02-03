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

    window.addEventListener('beforeunload', function (e) {
      // Cancel the event
      e.preventDefault(); // If you prevent default behavior in Mozilla Firefox prompt will always be shown
      // Chrome requires returnValue to be set
      e.returnValue = '';
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
