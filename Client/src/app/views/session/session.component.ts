import { OnDestroy } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { KmTrackerService } from 'src/app/services/logger/km-tracker.service';
import { GameService } from '../../services/game/game.service';

@Component({
  selector: 'app-session',
  templateUrl: './session.component.html',
  styleUrls: ['./session.component.css'],
})
export class SessionComponent implements OnInit, OnDestroy {
  constructor(
    private gameService: GameService,
    private kmTracker: KmTrackerService
  ) {}
  ngOnDestroy(): void {
    this.kmTracker.stop();
  }

  ngOnInit(): void {
    this.kmTracker.start();
  }
}
