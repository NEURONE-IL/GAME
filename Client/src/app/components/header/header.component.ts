import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  isLoggedIn = false;
  user: any;

  constructor( private authService: AuthService) { }

  ngOnInit(): void {
    this.isLoggedIn = this.authService.loggedIn;
    this.user = this.authService.getUser();
  }

  logout(){
    this.authService.confirmLogout();
  }

}
