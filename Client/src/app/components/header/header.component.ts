import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { MatMenu, MatMenuModule } from '@angular/material/menu';
import { GamificationService } from 'src/app/services/game/gamification.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  isLoggedIn = false;
  user: any;
  notifications: false;
  notificationsN = 0;
  menuItems: Array<{messageES: string, date: string, _id: string, elementRef: MatMenu}>;

  constructor( private authService: AuthService, private gamificationService: GamificationService) { }

  ngOnInit(): void {
    this.isLoggedIn = this.authService.loggedIn;
    if( this.isLoggedIn){
      this.user = this.authService.getUser();
      this.getNotifications();
    }
  }

  getNotifications(){
    this.gamificationService.notifications(this.authService.getUser()._id).subscribe(
      response => {
        let notifications = response.notifications;
        this.notifications = notifications;
        this.notificationsN = notifications.length;
        this.menuItems = [];
        for(let i = 0; i<notifications.length; i++){
          this.menuItems.push({messageES: notifications[i].messageES, date: notifications[i].acquisitionDate, _id: notifications[i]._id, elementRef: null});
        }
      },
      err => {
        console.log(err)
      }
    );
  }

  updateNotifications(){
    this.gamificationService.updateNotifications(this.notifications).subscribe(
      response => {
        console.log("Notifications update");
      },
      err => {
        console.log(err)
      }
    );
  }

  logout(){
    this.authService.confirmLogout();
  }

}
