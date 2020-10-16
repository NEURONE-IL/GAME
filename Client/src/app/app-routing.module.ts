import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './views/login/login.component';
import { StartComponent } from './views/start/start.component';

const routes: Routes = [
  {
    path: 'start',
    component: StartComponent,

  },
  { path: 'login', component: LoginComponent},
  { path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
