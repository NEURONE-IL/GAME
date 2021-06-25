import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { MatMenu, MatMenuModule } from '@angular/material/menu';
import { GamificationService } from 'src/app/services/game/gamification.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

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
  homeTooltip: string;

  constructor( private authService: AuthService, private gamificationService: GamificationService, public router: Router, private translate: TranslateService) { }

  ngOnInit(): void {
    this.isLoggedIn = this.authService.loggedIn;
    if( this.isLoggedIn){
      this.user = this.authService.getUser();
      this.getNotifications();
    }
    this.homeTooltip = this.translate.instant("GAME.SEARCH.TOOLTIP_BACK");
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

  goBack(){
    console.log('in')
    window.history.back();
  }

}
