import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { EngineerComponent } from './EditEngineer/EditEngineer.component';
import { ScheduleeditComponent } from './scheduleedit/scheduleedit.component';
import { NavbarComponent } from './navbar/navbar.component';


const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: 'login/register', component: RegisterComponent },
  { path: 'schedule', component: ScheduleComponent },
  { path: 'edituser', component: EngineerComponent },
  { path: 'editschedule', component: ScheduleeditComponent },
  { path: 'navbar', component: NavbarComponent }


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
