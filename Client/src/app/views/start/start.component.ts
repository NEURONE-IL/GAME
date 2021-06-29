import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { KmTrackerService } from 'src/app/services/logger/km-tracker.service';
import { GameService } from '../../services/game/game.service';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.css'],
})
export class StartComponent implements OnInit, OnDestroy {
  loading = true;

  constructor(
    public router: Router,
    public gameService: GameService,
    private kmTracker: KmTrackerService
  ) {}
  ngOnDestroy(): void {
    this.kmTracker.stop();
  }

  async continue(){
    await this.gameService.finishPlayAgain();
  }

  async ngOnInit(): Promise<void> {
    await this.gameService.load().then(() => {
      if (!this.gameService.loading) {
        this.kmTracker.start();
        this.loading = false;
      }
    });
  }
}

@Component({
  selector: 'app-start-instructions',
  templateUrl: './instructions.html',
  styleUrls: ['./start.component.css'],
})
export class StartInstructionsComponent {
  constructor(public router: Router, private gameService: GameService) {}

  doStart() {
    this.gameService.challengeStarted();
  }
}
