import { Component, OnInit , ViewChild} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { GamificationService } from 'src/app/services/game/gamification.service';
import { AuthService } from '../../services/auth/auth.service';


@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css']
})
export class AdminPanelComponent implements OnInit {

  constructor(private activatedRoute: ActivatedRoute, private router: Router, private gamificationService: GamificationService, private toastr: ToastrService, private translate: TranslateService, private authService: AuthService,) { }

  studioSelected;
  gamified: false;
  connected: false;
  search : string ="";

  ngOnInit(): void {
    this.checkPath();
    this.gamificationStatus();
  }

  CreateStudy(){
    this.router.navigate(['create/study']);
  }
  CreateChallenge(){
    this.router.navigate(['create/challenge']);
  }
  studySelectedHandler(event){
    this.studioSelected = true;
    this.router.navigate([event]);
  }

  gamificationStatus(){
    this.gamificationService.gamificationStatus().subscribe(
      response => {
        this.gamified = response.gamified;
        this.connected = response.connected;
      },
      err => {
        console.log(err)
      }
    );
  }
  getPublicStudies(param: string){
    this.router.navigate(['studies_search/results/'+param]);
  }

  gamify(){
    this.gamificationService.gamify().subscribe(
      response => {
        console.log(response);
        this.gamificationService.gamifyDependent().subscribe(
          response2 => {
            console.log(response2);
            this.toastr.success(this.translate.instant("ADMIN.GAMIFICATION.TOAST.SUCCESS_MESSAGE"), this.translate.instant("ADMIN.GAMIFICATION.TOAST.SUCCESS"), {
              timeOut: 5000,
              positionClass: 'toast-top-center'
            });
            this.gamificationStatus();
          },
          err => {
            this.toastr.error(this.translate.instant("ADMIN.GAMIFICATION.TOAST.ERROR_MESSAGE"), this.translate.instant("ADMIN.GAMIFICATION.TOAST.ERROR"), {
              timeOut: 5000,
              positionClass: 'toast-top-center'
            });
          }
        );
      },
      err => {
        this.toastr.error(this.translate.instant("ADMIN.GAMIFICATION.TOAST.ERROR_MESSAGE"), this.translate.instant("ADMIN.GAMIFICATION.TOAST.ERROR"), {
          timeOut: 5000,
          positionClass: 'toast-top-center'
        });
      }
    );
  }

  checkPath(){
    let path= this.router.url;
    //console.log('path', path);
    if(path!= '/admin_panel'){
      //console.log('in study');
      this.studioSelected = true;
    }else{
      this.studioSelected= false;
    }
  }
}
