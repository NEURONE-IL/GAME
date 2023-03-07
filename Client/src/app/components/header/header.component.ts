import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation, AfterViewInit} from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { MatMenu, MatMenuModule } from '@angular/material/menu';
import { GamificationService } from 'src/app/services/game/gamification.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Track } from 'ngx-audio-player';
import { NgbCarousel, NgbSlideEvent, NgbSlideEventSource } from '@ng-bootstrap/ng-bootstrap';
import { PlyrModule } from 'ngx-plyr';
import { ToastrService } from 'ngx-toastr';
import { InvitationService, Invitation } from 'src/app/services/admin/invitation.service';
import { Notification, NotificationService } from 'src/app/services/admin/notification.service';
import { notThisUser } from 'src/app/views/study-creation/study-creation.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, AfterViewInit {

  isLoggedIn = false;
  user: any;
  notifications: false;
  showOldNotifications:boolean = false;
  notificationsN = 0;
  adminNotificationN = 0;
  menuItems: Array<{messageES: string, date: string, _id: string, elementRef: MatMenu}>;
  notificationsAdmin: Notification[];
  newNotificationsAdmin: Notification[];
  oldNotificationsAdmin: Notification[] = [];
  homeTooltip: string;
  firstSession= false;
  videoModal= true;
  finished=false;
  search: String =""; //
  demoLink: String = "https://youtu.be/-rGoBqoStrE";

  @ViewChild('carousel', {static : true}) carousel: NgbCarousel;
  @ViewChild('content') myModal;

  constructor( private authService: AuthService,
               private gamificationService: GamificationService,
               private modalService: NgbModal,
               private translate: TranslateService,
               private plyrModule: PlyrModule,
               private toastr: ToastrService,
               public router: Router,
               private invitationService: InvitationService,
               private notificationService: NotificationService) { }

  ngOnInit(): void {
    this.isLoggedIn = this.authService.loggedIn;
    if( this.isLoggedIn){
      this.user = this.authService.getUser();
      this.getNotifications();
      this.getAdminNotification();
    }
    if(this.isLoggedIn && this.user.has_played){
      this.videoModal= false
    }


    this.homeTooltip = this.translate.instant("GAME.SEARCH.TOOLTIP_BACK");
  }

  ngAfterViewInit(): void{
    if(this.videoModal && this.isLoggedIn){
      this.openModal();
      this.hasPlayedUser();
    }
  }

  openModal(){
    /*Dispatch openhelpmodal event*/
    var evt = new CustomEvent('openhelpmodal');
    window.dispatchEvent(evt);
    /*End dispatch openhelpmodal event*/
    this.modalService.open(this.myModal, { size: 'xl' });
  }

  closeModal(){
    /*Dispatch closehelpmodal event*/
    var evt = new CustomEvent('closehelpmodal');
    window.dispatchEvent(evt);
    /*End dispatch closehelpmodal event*/
    return true;
  }

  hasPlayedUser(){
    this.authService.hasPlayed().subscribe((res)=>{
      console.log("has Played")
      this.authService.refreshUser();
    })
  }
  getAdminNotification(){
    this.notificationService.getNotificationByUser(this.authService.getUser()._id).subscribe(
      response => {
        this.notificationsAdmin = response.notifications;
        var activeNotification = 0;
        this.oldNotificationsAdmin = [];
        this.newNotificationsAdmin = [];

        this.notificationsAdmin.forEach( not => {
          let d = new Date(not.createdAt);
          let date = d.getDate() + (d.getMonth() < 10 ? '/0' : '/') + (d.getMonth() + 1) + '/' + d.getFullYear();          
          let hour = (d.getHours() < 10 ? '0' : '') +d.getHours() + ':' + (d.getMinutes() < 10 ? '0' : '') +d.getMinutes();
          not.createdAt = date + ' ' + hour;
          if(not.seen === false){
            activeNotification++;
            this.newNotificationsAdmin.push(not);
          }
          else{
            if ((not.type === 'invitation' || not.type === 'collabRequest') && not.invitation.status === 'Pendiente'){
              this.newNotificationsAdmin.push(not);
            }
            else{
              this.oldNotificationsAdmin.push(not);
            }
          }
          
        })
        this.adminNotificationN = activeNotification;
      },
      err => {
        console.log(err)
      }
    )
  }
  getNotifications(){
    this.gamificationService.notifications(this.authService.getUser()._id).subscribe(
      response => {
        let notifications = response.notifications;
        this.notifications = notifications;
        this.notificationsN = notifications.length;
        this.menuItems = [];
        for(let i = 0; i<notifications.length; i++){
          let message;
          if(notifications[i].name === 'givePoints'){
            let amount = notifications[i].messageES.split('Has recibido ')[1].split(' ')[0]
            if(amount >= 200){
              message = notifications[i].messageES + ' por completar un logro'
            }
            else {
              message = notifications[i].messageES + ' por enfrentar un desafío'
            }
          }
          else{
            message = notifications[i].messageES;
          }
          this.menuItems.push({messageES: message, date: notifications[i].acquisitionDate, _id: notifications[i]._id, elementRef: null});
        }
      },
      err => {
        console.log(err)
      }
    );
  }

  updateNotifications(){
    this.notificationsN = 0;
    this.gamificationService.updateNotifications(this.notifications).subscribe(
      response => {
        console.log("Notifications update");
      },
      err => {
        console.log(err)
      }
    );
  }

  updateAdminNotifications(){
    const seen = this.notificationsAdmin.some(not => not.seen == false);
    this.showOldNotifications = false;
    if(seen){
      this.notificationService.seeNotification(this.notificationsAdmin[0]).subscribe(
        response => {
          this.getAdminNotification();
        },
        err => {
          console.log(err)
        }
      );
    }
    else{
      this.getAdminNotification();
    }
  }

  acceptInvitation(item: Notification){
    this.invitationService.acceptInvitation(item.invitation, item.type).subscribe(
      response => {
        if(item.type ==='invitation'){
          this.toastr.success("Ahora es colaborador del estudio: "+ response.invitation.study.name+'. Puede revisarlo en la pestaña Colaboraciones','Éxito', {
            timeOut: 5000,
            positionClass: 'toast-top-center'
          });
        }
        else{
          this.toastr.success(response.invitation.user.names+' '  +response.invitation.user.last_names + " ahora es colaborador de su estudio: "+ response.invitation.study.name,'Éxito', {
            timeOut: 5000,
            positionClass: 'toast-top-center'
          });
        }
        
        this.getAdminNotification();
      },
      err => {
        console.log(err)
        this.toastr.error("Ha ocurrido un error al aceptar, intente más tarde", "Error", {
          timeOut: 5000,
          positionClass: 'toast-top-center'
        });
      }
    );
  }
  rejectInvitation(item: Notification){
    this.invitationService.rejectInvitation(item.invitation, item.type).subscribe(
      response => {
        if(item.type === 'invitation')
          this.toastr.success("Ha rechazado la invitación a colaborar en el estudio: "+ response.invitation.study.name,"Éxito", {
            timeOut: 5000,
            positionClass: 'toast-top-center'
          });
        else
          this.toastr.success("Ha rechazado la colaboración de: " + response.invitation.user.names+' '  +response.invitation.user.last_names + " en el estudio: "+ response.invitation.study.name,"Éxito", {
            timeOut: 5000,
            positionClass: 'toast-top-center'
          });
        this.getAdminNotification();
      },
      err => {
        console.log(err)
        this.toastr.error("Ha ocurrido un error al rechazar, intente más tarde","Error", {
          timeOut: 5000,
          positionClass: 'toast-top-center'
        });
      }
    );
  }
  redirectStudy(study_id: string){
    this.router.navigate(['/studies_search/study/'+study_id])

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
            "Instrucciones_TriviaA",
            "Instrucciones_TriviaB",
            'Instrucciones_TriviaC',
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
      src: '/assets/audio/triviaInstrucciones.mp4',
    },
  ];


  played(event: Plyr.PlyrEvent) {
    console.log('played', event);

  }
  initPlayer($event){
    this.player = $event;
    this.player.play();
  }
  play(): void {
    this.player.play();
  }

  playerEnded(){
    //this.modalService.dismissAll();
    this.finished = true;
    this.videoModal = false;
  }

  CarrucelInterval = 100000;
  stopTimes=[17, 34, 48, 66, 75, 82];
  segmentoActual=0;
  captureTimeAndAdvanceSlide(){
    let actualTime = this.player.currentTime;
    if (actualTime > this.stopTimes[this.segmentoActual] ){
      this.CarrucelInterval = 1000;
    }
    if (actualTime > this.stopTimes[this.segmentoActual]+1.5 ){
      this.segmentoActual += 1;
      this.CarrucelInterval = 100000;
    }
  }

  modalHelp(content){
    this.modalService.open(content, { size: 'xl' });

  }
}
