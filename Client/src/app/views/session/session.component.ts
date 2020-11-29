import { Component, OnInit } from '@angular/core';
import { GameService } from '../../services/game/game.service';

@Component({
  selector: 'app-session',
  templateUrl: './session.component.html',
  styleUrls: ['./session.component.css']
})
export class SessionComponent implements OnInit {

  constructor(private gameService: GameService) {
  }

  ngOnInit(): void {
  }

}
