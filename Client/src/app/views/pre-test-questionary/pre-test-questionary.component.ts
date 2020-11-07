import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-pre-test-questionary',
  templateUrl: './pre-test-questionary.component.html',
  styleUrls: ['./pre-test-questionary.component.css']
})
export class PreTestQuestionaryComponent implements OnInit {
  acquainted: number;
  difficulty: number;
  values: number[] = [1, 2, 3, 4, 5, 6];
  checked: boolean;

  constructor() { }

  ngOnInit(): void {
  }

}
