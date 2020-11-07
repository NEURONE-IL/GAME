import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {
  acquainted: number;
  difficulty: number;
  values: number[] = [1, 2, 3, 4, 5, 6];
  checked: boolean;
  
  constructor() { }

  ngOnInit(): void {
  }

}
