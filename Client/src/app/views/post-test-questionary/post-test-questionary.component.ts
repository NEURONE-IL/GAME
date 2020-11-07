import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-post-test-questionary',
  templateUrl: './post-test-questionary.component.html',
  styleUrls: ['./post-test-questionary.component.css']
})
export class PostTestQuestionaryComponent implements OnInit {
  certainty: number;
  difficulty: number;
  values: number[] = [1, 2, 3, 4, 5, 6];  
  checked: boolean;

  constructor() { }

  ngOnInit(): void {
  }

}
