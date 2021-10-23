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
  cuarto = ['welcome/60ca3081fcac5ccc3b987599', 'welcome/60de210907dec2640f18e915']; 
  sexto = ['welcome/60de215707dec2640f18e91e', 'welcome/60de221f07dec2640f18e92f'];
  octavo = ['welcome/60dfd91707dec2640f18e977', 'welcome/60e5e96694cb44de340ff1c6'];
  selected;

  constructor(private route: ActivatedRoute, private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    const course = this.route.snapshot.paramMap.get('course');
    this.selectCourse(course);
    this.getForward(course);
  }

  selectCourse(course){
    if(course === 'cuarto'){
      this.selected = this.cuarto
    }
    if(course === 'sexto'){
      this.selected = this.sexto
    }
    if(course === 'octavo'){
      this.selected = this.octavo
    }
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
