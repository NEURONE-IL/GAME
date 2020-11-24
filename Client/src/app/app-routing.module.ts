import { Component, NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DirectAccessGuard } from './helpers/direct-access.guard';
import { LoginComponent } from './views/login/login.component';
import { SearchResultComponent } from './views/search-result/search-result.component';
import { SearchComponent } from './views/search/search.component';
import { SessionComponent } from './views/session/session.component';
import { SignupComponent } from './views/signup/signup.component';
import { StartComponent } from './views/start/start.component';
import { ViewPageComponent } from './views/view-page/view-page.component';
import { QuestionnaireComponent } from './views/questionnaire/questionnaire.component';
import { InitialQuestionnaireComponent } from './views/initial-questionnaire/initial-questionnaire.component';
import { PreTestQuestionnaireComponent } from './views/pre-test-questionnaire/pre-test-questionnaire.component';
import { PostTestQuestionnaireComponent } from './views/post-test-questionnaire/post-test-questionnaire.component';
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

const routes: Routes = [
  {
    path: 'start',
    canActivate: [ AuthGuard ],
    component: StartComponent
  },
  {
    path: 'questionnaire',
    component: QuestionnaireComponent,
    canActivate: [ AuthGuard ],
    children: [
      {
        path: 'initial',
        component: InitialQuestionnaireComponent,
      },
      {
        path: 'pre-test',
        component: PreTestQuestionnaireComponent,
      },
      {
        path: 'post-test',
        component: PostTestQuestionnaireComponent,
      }
    ]
  },
  {
    path: 'session',
    component: SessionComponent,
    canActivate: [DirectAccessGuard],
    children: [
      {
        path: 'search', // child route path
        component: SearchComponent, // child route component that the router renders
        canActivate: [DirectAccessGuard]
      },
      {
        path: 'search-result/:query',
        component: SearchResultComponent,
        canActivate: [DirectAccessGuard]
      },
      {
        path: 'view-page/:url',
        component: ViewPageComponent,
        canActivate: [DirectAccessGuard]
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
    component: LoginComponent
  },
  { path: 'signup/:study_id', component: SignupComponent},
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
