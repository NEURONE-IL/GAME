import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { StudyService } from '../services/game/study.service';

@Injectable({
  providedIn: 'root'
})
export class ProtectStudyEditionGuard implements CanActivate {
  constructor(private authService: AuthService, private studyService: StudyService, private router: Router){}

  canActivate(next: ActivatedRouteSnapshot,state: RouterStateSnapshot): 
    Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      
      let owner: boolean;
      let collaborator: boolean;
      let validate: boolean
      const validation = async () => {
      await this.studyService.getStudy(next.paramMap.get('study_id')).toPromise()
        .then(response => {
          let study = response['study'];
          let _user_id = this.authService.getUser()._id
          owner =  study.user._id === _user_id
          collaborator = study.collaborators.some(coll => (coll.user._id === _user_id && coll.invitation != 'Pendiente'))
        })
        .catch(err => {console.log(err); return this.router.navigate(['/admin_panel']) })
        
        if(owner || collaborator){
          return true;
        }
        else{
          return this.router.navigate(['/admin_panel']);
        }  
     }
      return validation();
    }

}
