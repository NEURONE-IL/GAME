import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-consent',
  templateUrl: './consent.component.html',
  styleUrls: ['./consent.component.css']
})
export class ConsentComponent implements OnInit {

  @Input() mode: string;
  consentSource = "/assets/docs/consent.pdf";
  isLoaded = false;
  page = 1;
  totalPages: number;

  constructor() { }

  ngOnInit(): void {
    if (this.mode=='assent') {
      this.consentSource = "/assets/docs/assent.pdf";
    }
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
