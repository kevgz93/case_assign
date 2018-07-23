import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { EngineerComponent } from './EditEngineer/EditEngineer.component';
import { ScheduleeditComponent } from './scheduleedit/scheduleedit.component';
import { NavbarComponent } from './navbar/navbar.component';
import { LogoutComponent } from './logout/logout.component';
import { ReportComponent } from './report/report.component';
import { RotationComponent } from './rotation/rotation.component';
import { RotationeditComponent } from './rotationedit/rotationedit.component';
import { ScheduleshowComponent } from './scheduleshow/scheduleshow.component';
import { EditusersComponent } from './editusers/editusers.component';
import { WeekendRotationComponent } from './weekendRotation/weekendRotation.component';
import { TimeoffComponent } from './timeoff/timeoff.component';


const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: 'login/register', component: RegisterComponent },
  { path: 'schedule', component: ScheduleComponent },
  { path: 'editengineer', component: EngineerComponent },
  { path: 'editschedule', component: ScheduleeditComponent },
  { path: 'navbar', component: NavbarComponent },
  { path: 'logout', component: LogoutComponent },
  { path: 'report', component: ReportComponent },
  { path: 'rotation', component: RotationComponent },
  { path: 'editrotation', component: RotationeditComponent },
  { path: 'showschedule', component: ScheduleshowComponent },
  { path: 'editusers', component: EditusersComponent },
  { path: 'weekendRotation', component: WeekendRotationComponent },
  { path: 'edittimeoff', component: TimeoffComponent }


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
