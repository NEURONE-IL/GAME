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
import { QuestionaryComponent } from './views/questionary/questionary.component';
import { InitialQuestionaryComponent } from './views/initial-questionary/initial-questionary.component';
import { PreTestQuestionaryComponent } from './views/pre-test-questionary/pre-test-questionary.component';
import { PostTestQuestionaryComponent } from './views/post-test-questionary/post-test-questionary.component';
import { UploadComponent } from './views/upload/upload.component';
import { ResourceUploadComponent } from './views/resource-upload/resource-upload.component';
import { CreationComponent } from './views/creation/creation.component';
import { ChallengeCreationComponent } from './views/challenge-creation/challenge-creation.component';
import { StudyCreationComponent } from './views/study-creation/study-creation.component';
import { AdminPanelComponent } from './views/admin-panel/admin-panel.component';
import { AuthGuard } from './helpers/auth.guard';
import { AdminGuard } from './helpers/admin.guard';

const routes: Routes = [
  {
    path: 'start',
    component: StartComponent
  },
  {
    path: 'questionary',
    component: QuestionaryComponent,
    //canActivate: [DirectAccessGuard],
    children: [
      {
        path: 'initial',
        component: InitialQuestionaryComponent,
        //canActivate: [DirectAccessGuard],
      },
      {
        path: 'pre-test',
        component: PreTestQuestionaryComponent,
        //canActivate: [DirectAccessGuard],
      },
      {
        path: 'post-test',
        component: PostTestQuestionaryComponent,
        //canActivate: [DirectAccessGuard],
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
    //canActivate: [DirectAccessGuard],
    children: [
      {
        path: 'challenge',
        component: ChallengeCreationComponent,
        //canActivate: [DirectAccessGuard],
      },
      {
        path: 'study',
        component: StudyCreationComponent,
        //canActivate: [DirectAccessGuard],
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
    canActivate: [
      AuthGuard,
      AdminGuard
    ],
    component: AdminPanelComponent
  },
  { path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
