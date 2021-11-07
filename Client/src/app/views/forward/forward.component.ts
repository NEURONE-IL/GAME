import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-forward',
  templateUrl: './forward.component.html',
  styleUrls: ['./forward.component.css']
})
export class ForwardComponent implements OnInit {

  registerLink;
  cuarto = 'welcome/6183f67e08d3b0434cb409f6'
  sexto = 'welcome/618404e008d3b0434cb40a5b'
  octavo = 'welcome/6181d179be68b12ecfa4b532'
  segundom = 'welcome/61856599500e1adced97938f'
  tercerocuarto = 'welcome/618565b1500e1adced979396'
  selected;

  constructor(private route: ActivatedRoute, private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    const course = this.route.snapshot.paramMap.get('course');
    this.selectCourse(course);

  }

  selectCourse(course){
    if(course === 'Cuarto6183f67e08d3b0434cb409f6'){
      this.selected = this.cuarto
    }
    if(course === 'Sexto618404e008d3b0434cb40a5b'){
      this.selected = this.sexto
    }
    if(course === 'Octavo6181d179be68b12ecfa4b532'){
      this.selected = this.octavo
    }
    if(course === 'SegundoM61856599500e1adced97938f'){
      this.selected = this.segundom
    }
    if(course === 'TerceroCuarto618565b1500e1adced979396'){
      this.selected = this.tercerocuarto
    }
    this.router.navigate([this.selected]);
  }


  getForward(course){
    this.authService.getForward(course).subscribe(
      response => {
        let forward = response['forward'];
        if(!forward){
          this.registerLink = this.selected[0];
          this.postForward(course, this.registerLink);
          this.router.navigate([this.registerLink]);
        }
        else{
          if(forward.lastLink === this.selected[0]){
            this.registerLink = this.selected[1];
            this.postForward(course, this.registerLink);
            this.router.navigate([this.registerLink]);
          }
          else{
            this.registerLink = this.selected[0];
          this.postForward(course, this.registerLink);
          this.router.navigate([this.registerLink]);
          }
        }
      },
      err => {
        console.log(err)
      }
    )
  }

  postForward(course, lastLink){
    this.authService.postForward(course, lastLink).subscribe(
      response => {
        console.log('Ok')
      },
      err => {
        console.log(err)
      }
    )
  }

}
