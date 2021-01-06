import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DirectAccessGuard } from './helpers/direct-access.guard';
import { LoginComponent } from './views/login/login.component';
import { SearchResultComponent } from './views/search-result/search-result.component';
import { SearchComponent } from './views/search/search.component';
import { SessionComponent } from './views/session/session.component';
import { SignupComponent } from './views/signup/signup.component';
import { StartComponent } from './views/start/start.component';
import { ViewPageComponent } from './views/view-page/view-page.component';
import { UploadComponent } from './views/upload/upload.component';
import { ResourceUploadComponent } from './views/resource-upload/resource-upload.component';
import { CreationComponent } from './views/creation/creation.component';
import { ChallengeCreationComponent } from './views/challenge-creation/challenge-creation.component';
import { StudyCreationComponent } from './views/study-creation/study-creation.component';
import { AdminPanelComponent } from './views/admin-panel/admin-panel.component';
import { StudiesDisplayComponent } from './views/studies-display/studies-display.component';
import { StudyDisplayComponent } from './views/study-display/study-display.component';
import { AuthGuard } from './helpers/auth.guard';
import { AdminGuard } from './helpers/admin.guard';
import { NotLoggedInGuard } from './helpers/not-logged-in.guard';
import { UserProfileComponent } from './views/user-profile/user-profile.component';

const routes: Routes = [
  {
    path: 'start',
    canActivate: [AuthGuard],
    component: StartComponent,
  },
  {
    path: 'session',
    component: SessionComponent,
//    canActivate: [DirectAccessGuard],
    children: [
      {
        path: 'search', // child route path
        component: SearchComponent, // child route component that the router renders
//        canActivate: [DirectAccessGuard]
      },
      {
        path: 'search-result/:query/:locale/:domain',
        component: SearchResultComponent,
//        canActivate: [DirectAccessGuard]
      },
      {
        path: 'view-page/:title/:url',
        component: ViewPageComponent,
//        canActivate: [DirectAccessGuard]
      }
    ]
  },
  {
    path: 'upload',
    component: UploadComponent,
    //canActivate: [DirectAccessGuard],
    children: [
      {
        path: 'resource',
        component: ResourceUploadComponent,
        //canActivate: [DirectAccessGuard],
      }
    ]
  },
  {
    path: 'create',
    component: CreationComponent,
    canActivate: [ AuthGuard, AdminGuard ],
    children: [
      {
        path: 'challenge',
        component: ChallengeCreationComponent
      },
      {
        path: 'study',
        component: StudyCreationComponent
      }
    ]
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [ NotLoggedInGuard ]
  },
  {
    path: 'login/confirmedOK',
    component: LoginComponent,
    canActivate: [ NotLoggedInGuard ]
  },
  { path: 'signup/:study_id',
    component: SignupComponent,
    canActivate: [ NotLoggedInGuard ]
  },
  {
    path: 'user-profile',
    component: UserProfileComponent
  },
  {
    path: 'admin_panel',
    component: AdminPanelComponent,
    canActivate: [ AuthGuard, AdminGuard ],
    children: [
      {
        path: 'studies',
        component: StudiesDisplayComponent,
        //canActivate: [ AuthGuard, AdminGuard ],
      },
      {
        path: 'study/:study_id',
        component: StudyDisplayComponent,
        //canActivate: [ AuthGuard, AdminGuard ],
      }
    ]
  },
  { path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
