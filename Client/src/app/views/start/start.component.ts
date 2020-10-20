import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.css']
})
export class StartComponent implements OnInit {

  constructor(public router: Router) { }

  ngOnInit(): void {
  }

  doStart(){
    this.router.navigate(['session/search']);
  }

}
