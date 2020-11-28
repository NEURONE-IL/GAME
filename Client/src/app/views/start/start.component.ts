import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GameService } from '../../services/game/game.service';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.css']
})
export class StartComponent implements OnInit {

  stage = "start";

  constructor(public router: Router, private gameService: GameService) { }

  ngOnInit(): void {
  }

  doStart(){
    this.router.navigate(['session/search']);
  }

  nextStage() {
    if(this.stage=="assent") this.stage="initial";
    else if(this.stage=="initial") this.stage="pretest";
    else if(this.stage=="pretest") this.stage="start";
  }

}
