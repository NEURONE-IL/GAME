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

const routes: Routes = [
  {
    path: 'start',
    component: StartComponent
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
  { path: 'login', component: LoginComponent},
  { path: 'signup/:study_id', component: SignupComponent},
  { path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
