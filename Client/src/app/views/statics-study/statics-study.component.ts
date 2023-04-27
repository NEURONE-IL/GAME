import { Component, OnInit } from '@angular/core';

interface Metric {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-statics-study',
  templateUrl: './statics-study.component.html',
  styleUrls: ['./statics-study.component.css']
})
export class StaticsStudyComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  selectedValue: string;
  selectedCar: string;

  metrics: Metric[] = [
    { value: 'Total Coverage', viewValue: 'Total Coverage' },
    { value: 'Relevant Coverage', viewValue: 'Relevant Coverage' },
    { value: 'Precision', viewValue: 'Precision' },
    { value: 'Recall', viewValue: 'Recall' },
    { value: 'F-score', viewValue: 'F-Score' },
    { value: 'Useful-coverage', viewValue: 'Useful Coverage' },
    { value: 'Number-queries', viewValue: 'Number of Queries' },
    { value: 'Coverage-effectiveness', viewValue: 'Coverage Effectiveness' },
    { value: 'Query-effectiveness', viewValue: 'Query Effectiveness' },
    { value: 'Active-bookmarks', viewValue: 'Active Bookmarks' },
    { value: 'Search-score', viewValue: 'Search Score' },
    { value: 'Total-page-stay', viewValue: 'Total Page Stay' },
    { value: 'Page-stay', viewValue: 'Page Stay' },
    { value: 'Query-entropy', viewValue: 'Query Entropy' },
    { value: 'Writing-time-query', viewValue: 'Writing Time Query' },
    { value: 'Total-query-modification', viewValue: 'Total Query Modification' },
    { value: 'If-quotes', viewValue: 'If Quotes' },
    { value: 'First-query-time', viewValue: 'First Query Time' },
  ];
}
