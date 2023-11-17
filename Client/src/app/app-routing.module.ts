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
import { CreationComponent } from './views/creation/creation.component';
import { ChallengeCreationComponent } from './views/challenge-creation/challenge-creation.component';
import { StudyCreationComponent } from './views/study-creation/study-creation.component';
import { AdminPanelComponent } from './views/admin-panel/admin-panel.component';
import { StudiesDisplayComponent } from './views/studies-display/studies-display.component';
import { StudyDisplayComponent } from './views/study-display/study-display.component';
import { AuthGuard } from './helpers/auth.guard';
import { AdminGuard } from './helpers/admin.guard';
import { ProtectStudyEditionGuard } from './helpers/protect-study-edition.guard';
import { NotLoggedInGuard } from './helpers/not-logged-in.guard';
import { AsExternalServiceGuard } from './helpers/as-external-service.guard';
import { UserProfileComponent } from './views/user-profile/user-profile.component';
import { RecoveryComponent } from './views/recovery/recovery.component';
import { ForgotPasswordComponent } from './views/forgot-password/forgot-password.component';
import { LoginRedirectComponent } from './views/login-redirect/login-redirect.component';
import { TriviaHubComponent } from './views/trivia-hub/trivia-hub.component';
import { TriviaHubOpenComponent } from './views/trivia-hub-open/trivia-hub-open.component';
import { ForwardComponent } from './views/forward/forward.component';
import { StudiesSearchComponent } from './views/studies-search/studies-search.component';
import { StudiesSearchResultsComponent } from './views/studies-search-results/studies-search-results.component';
import { StudySearchDisplayComponent } from './views/study-search-display/study-search-display.component';
import { StaticsStudyComponent } from './views/statics-study/statics-study.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'prefix',
    redirectTo: 'login',
  },
  {
    path: 'welcome/:study_id',
    component: TriviaHubComponent,
    canActivate: [ NotLoggedInGuard ]
  }, 
  {
    path: 'welcome',
    component: TriviaHubComponent,
    canActivate: [ NotLoggedInGuard ]
  },
  {
    path: 'participa',
    component: TriviaHubOpenComponent,
    canActivate: [ NotLoggedInGuard ]
  },  
  {
    path: 'start',
    canActivate: [AuthGuard],
    component: StartComponent,
  },
  {
    path: 'session',
    component: SessionComponent,
    canActivate: [DirectAccessGuard],
    children: [
      {
        path: 'search', // child route path
        component: SearchComponent, // child route component that the router renders
//        canActivate: [DirectAccessGuard]
      },
      {
        path: 'search-result/:query/:domain',
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
    path: 'view-page/:title/:url',
    component: ViewPageComponent,
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
    path: 'studies_search',
    component: StudiesSearchComponent,
    canActivate: [ AuthGuard, AdminGuard ],
    children: [
      {
        path: 'results/:term',
        component: StudiesSearchResultsComponent
      },
      {
        path: 'study/:study_id',
        component: StudySearchDisplayComponent
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
  {
    path: 'login/alreadyConfirmed',
    component: LoginComponent,
    canActivate: [ NotLoggedInGuard ]
  },
  { path: 'signup/:study_id',
    component: SignupComponent,
    canActivate: [ NotLoggedInGuard ]
  },
  {
    path: 'user-profile',
    component: UserProfileComponent,
    canActivate: [AuthGuard, AsExternalServiceGuard]
  },
  {
    path: 'statistics/:user_id',
    component: StaticsStudyComponent,
    canActivate: [AuthGuard, AsExternalServiceGuard]
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
        canActivate: [ ProtectStudyEditionGuard ],
      },
      {
        path: 'study/:study_id/statics',
        component: StaticsStudyComponent,
        canActivate: [ ProtectStudyEditionGuard ],
      },
    ]
  },
  {
    path: 'forgot_password',
    component: ForgotPasswordComponent,
    canActivate: [ NotLoggedInGuard ]
  },
  {
    path: 'user/resetPassword/:token',
    component: RecoveryComponent,
    canActivate: [ NotLoggedInGuard ]    
  },
  {
    path: 'login_redirect/:email/:names/:study/:trainer_id/:api_key/:url',
    component: LoginRedirectComponent
  }, 
  {
    path: 'forward/:course',
    component: ForwardComponent
  }, 
  { path: '**', redirectTo: 'login' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
