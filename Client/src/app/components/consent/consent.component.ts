import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-consent',
  templateUrl: './consent.component.html',
  styleUrls: ['./consent.component.css']
})
export class ConsentComponent implements OnInit {

  @Input() mode: string;
  consentSource = "https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf";
  isLoaded = false;
  page = 1;
  totalPages: number;

  constructor() { }

  ngOnInit(): void {
  }

  afterLoadComplete(pdfData: any) {
    this.totalPages = pdfData.numPages;
    this.isLoaded = true;
  }

  onError(error: any) {
    console.log(error);
  }

  nextPage() {
    this.page++;
  }

  prevPage() {
    this.page--;
  }

}
