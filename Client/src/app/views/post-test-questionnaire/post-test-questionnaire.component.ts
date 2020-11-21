import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-post-test-questionnaire',
  templateUrl: './post-test-questionnaire.component.html',
  styleUrls: ['./post-test-questionnaire.component.css']
})
export class PostTestQuestionnaireComponent implements OnInit {
  certainty: number;
  difficulty: number;
  values: number[] = [1, 2, 3, 4, 5, 6];  
  checked: boolean;

  constructor() { }

  ngOnInit(): void {
  }

}
