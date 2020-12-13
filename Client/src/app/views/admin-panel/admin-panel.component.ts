import { Component, OnInit , ViewChild} from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css']
})
export class AdminPanelComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.checkPath();
  }
  StudioSelected;
  CreateStudy(){
    this.router.navigate(['create/study']);
  }
  CreateChallenge(){
    this.router.navigate(['create/challenge']);
  }
  studySelectedHandler(event){
    this.StudioSelected = true;
    this.router.navigate([event]);

  }

  checkPath(){
    let path= this.router.url;
    console.log('path', path);
    if(path!= '/admin_panel'){
      console.log('in study');
      this.StudioSelected = true;
    }else{
      this.StudioSelected= false;
    }
  }
}
