import {Component, ElementRef, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { MatMenu, MatMenuModule } from '@angular/material/menu';
import { GamificationService } from 'src/app/services/game/gamification.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Track } from 'ngx-audio-player';
import { NgbCarousel, NgbSlideEvent, NgbSlideEventSource } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  isLoggedIn = false;
  user: any;
  notifications: false;
  notificationsN = 0;
  menuItems: Array<{messageES: string, date: string, _id: string, elementRef: MatMenu}>;
  homeTooltip: string;

  @ViewChild('carousel', {static : true}) carousel: NgbCarousel;

  constructor( private authService: AuthService,
               private gamificationService: GamificationService,
               private modalService: NgbModal,
               private translate: TranslateService,
               public router: Router) { }

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

  //Modal de ayuda
  modalHelp(content){
    this.modalService.open(content, { size: 'xl' });
  }

  msaapDisplayTitle = false;
  msaapDisplayPlayList = false;
  msaapPageSizeOptions = [2,4,6];
  msaapDisplayVolumeControls = true;
  msaapDisplayRepeatControls = false;
  msaapDisplayArtist = false;
  msaapDisplayDuration = false;
  msaapDisablePositionSlider = true;

  images = ["Instrucciones_Trivia_1",
            "Instrucciones_Trivia_2",
            "Instrucciones_Trivia_3",
            "Instrucciones_Trivia_4",
            "Instrucciones_Trivia_5",
            "Instrucciones_Trivia_6",
            "Instrucciones_Trivia_7"
  ];

getTrack(trackName){
  let lista: Track[] = [
    {
      title: 'Audio One Title',
      link: '/assets/audio/' +trackName+'.mp3',
    }
  ];
  return lista
}
  msaapPlaylist: Track[] = [
    {
      title: 'Audio One Title',
      link: '/assets/audio/Instrucciones_Trivia_1.mp3',
      duration: 17
    },{
      title: 'Audio One Title',
      link: '/assets/audio/Instrucciones_Trivia_2.mp3',
      duration: 18
    },{
      title: 'Audio One Title',
      link: '/assets/audio/Instrucciones_Trivia_3.mp3',
      duration: 13
    },{
      title: 'Audio One Title',
      link: '/assets/audio/Instrucciones_Trivia_4.mp3',
      duration: 19
    },{
      title: 'Audio One Title',
      link: '/assets/audio/Instrucciones_Trivia_5.mp3',
      duration: 8
    },{
      title: 'Audio One Title',
      link: '/assets/audio/Instrucciones_Trivia_6.mp3',
      duration: 7
    },{
      title: 'Audio One Title',
      link: '/assets/audio/Instrucciones_Trivia_7.mp3',
      duration: 6
    }
  ];

  onSlide(e){
    let slide= this.carousel.activeId;
    this.carousel.interval= this.msaapPlaylist[slide].duration*1000;

  }
  onEnded(e){
    console.log("fin del track")
    this.carousel.next(NgbSlideEventSource.ARROW_RIGHT);

  }

  buttonTest(){
    this.carousel.next(NgbSlideEventSource.ARROW_RIGHT);

  }

}
