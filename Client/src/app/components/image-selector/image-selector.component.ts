import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-image-selector',
  templateUrl: './image-selector.component.html',
  styleUrls: ['./image-selector.component.css']
})
export class ImageSelectorComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<ImageSelectorComponent>) { }
  selectedImage= '';
  images = [{title: 'Profile 1', url: "/assets/profile_images/profile1.png"}, {title: 'Profile 2', url: "/assets/profile_images/profile2.png"},
  {title: 'Profile 3', url: "/assets/profile_images/profile3.png"}, {title: 'Profile 4', url: "/assets/profile_images/profile4.png"}]
  ngOnInit(): void {
    this.selectedImage = this.images[0].url;
  }

  submitForm(){
    this.dialogRef.close(this.selectedImage);
  }

  onClickNO(){
    this.dialogRef.close();
  }

}
