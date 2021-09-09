import {Component, ElementRef, OnInit, ViewChild, ViewEncapsulation, AfterViewInit} from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { MatMenu, MatMenuModule } from '@angular/material/menu';
import { GamificationService } from 'src/app/services/game/gamification.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Track } from 'ngx-audio-player';
import { NgbCarousel, NgbSlideEvent, NgbSlideEventSource } from '@ng-bootstrap/ng-bootstrap';
import { PlyrModule } from 'ngx-plyr';

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
  firstSession= false;

  @ViewChild('carousel', {static : true}) carousel: NgbCarousel;

  constructor( private authService: AuthService,
               private gamificationService: GamificationService,
               private modalService: NgbModal,
               private translate: TranslateService,
               private plyrModule: PlyrModule,
               public router: Router) { }

  ngOnInit(): void {
    this.isLoggedIn = this.authService.loggedIn;
    if( this.isLoggedIn){
      this.user = this.authService.getUser();
      this.getNotifications();
      //Aquí llamar al modal
      this.hasPlayedUser();
    }
    this.homeTooltip = this.translate.instant("GAME.SEARCH.TOOLTIP_BACK");
  }

  hasPlayedUser(){
    this.authService.hasPlayed().subscribe((res)=>{
      console.log("has Played")
      if(! res.user.has_played){
        this.firstSession = true;
        this.modalService.open('content', { size: 'xl' });
      }
    })
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



  player: Plyr;

  videoSources: Plyr.Source[] = [
    {
      src: '/assets/audio/voice_instructions_confondo.mp3',
    },
  ];

  played(event: Plyr.PlyrEvent) {
    console.log('played', event);

  }
  initPlayer($event){
    this.player = $event
    this.player.play();
  }
  play(): void {
    this.player.play();
  }

  playerEnded(){
    this.modalService.dismissAll();
    this.firstSession = false;
  }

  CarrucelInterval = 100000
  stopTimes=[17, 34, 48, 66, 75, 82]
  segmentoActual=0
  captureTimeAndAdvanceSlide(){
    let actualTime = this.player.currentTime;
    if (actualTime > this.stopTimes[this.segmentoActual] ){
      this.CarrucelInterval = 1000
    }
    if (actualTime > this.stopTimes[this.segmentoActual]+1.5 ){
      this.segmentoActual += 1
      this.CarrucelInterval = 100000
    }
  }

  modalHelp(content){
    this.modalService.open(content, { size: 'xl' });

  }
}
