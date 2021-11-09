import { OnDestroy } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { KmTrackerService } from 'src/app/services/logger/km-tracker.service';
import { ActionsTrackerService } from 'src/app/services/logger/actions-tracker.service';
import { GameService } from '../../services/game/game.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-session',
  templateUrl: './session.component.html',
  styleUrls: ['./session.component.css'],
})
export class SessionComponent implements OnInit, OnDestroy {

  constructor(
    private gameService: GameService,
    private kmTracker: KmTrackerService,
    private actionsTracker: ActionsTrackerService,
    public router: Router
  ) {}
  ngOnDestroy(): void {
    this.kmTracker.stop();
    this.actionsTracker.stop();
  }

  ngOnInit(): void {
    this.kmTracker.start();
    this.actionsTracker.start();
  }
}
