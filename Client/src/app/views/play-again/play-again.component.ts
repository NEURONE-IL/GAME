import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { GameService } from 'src/app/services/game/game.service';

@Component({
  selector: 'app-play-again',
  templateUrl: './play-again.component.html',
  styleUrls: ['./play-again.component.css']
})
export class PlayAgainComponent implements OnInit {

  constructor(private gameService: GameService, public authService: AuthService) { }

  ngOnInit(): void {

  }

  async yes(){
    await this.gameService.continue();
  }

  async no(){
    await this.gameService.finishPlayAgain();
  }

}
