import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './views/login/login.component';
import { SearchResultComponent } from './views/search-result/search-result.component';
import { SearchComponent } from './views/search/search.component';
import { StartComponent } from './views/start/start.component';
import { ViewPageComponent } from './views/view-page/view-page.component';

const routes: Routes = [
  {
    path: 'start',
    component: StartComponent,
    children: [
      {
        path: 'search', // child route path
        component: SearchComponent, // child route component that the router renders
      },
      {
        path: 'search-result',
        component: SearchResultComponent
      },
      {
        path: 'view-page/:url',
        component: ViewPageComponent
      }
    ]
  },
  { path: 'login', component: LoginComponent},
  { path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
