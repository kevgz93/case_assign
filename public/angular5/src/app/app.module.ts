import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { HomeComponent } from './home/home.component';
import { ApiService } from './api.service';
import { HttpClientModule } from '@angular/common/http';
import { EngineerComponent } from './EditEngineer/EditEngineer.component';
import { LoginComponent } from './login/login.component';
import { CookieService } from 'ngx-cookie-service';
import { RegisterComponent } from './register/register.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { MyDateRangePickerModule  } from 'mydaterangepicker';
import { ScheduleeditComponent } from './scheduleedit/scheduleedit.component';
import { LogoutComponent } from './logout/logout.component';
import { ReportComponent } from './report/report.component';
import { RotationComponent } from './rotation/rotation.component';
import { RotationeditComponent } from './rotationedit/rotationedit.component';
import { ScheduleshowComponent } from './scheduleshow/scheduleshow.component';
import { EditusersComponent } from './editusers/editusers.component';
import { MatDialogModule } from '@angular/material';
import { WeekendRotationComponent} from './weekendRotation/weekendRotation.component';
// Calendar Module
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CalendarModule } from 'angular-calendar';
import { CalendarWeekHoursViewModule } from 'angular-calendar-week-hours-view';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { ModalModule } from 'ngx-bootstrap/modal';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    EngineerComponent,
    LoginComponent,
    RegisterComponent,
    ScheduleComponent,
    ScheduleeditComponent,
    LogoutComponent,
    ReportComponent,
    RotationComponent,
    RotationeditComponent,
    ScheduleshowComponent,
    EditusersComponent,
    WeekendRotationComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MyDateRangePickerModule,
    MatDialogModule,
    BrowserAnimationsModule,
    CalendarModule.forRoot(),
    CalendarWeekHoursViewModule,
    NgbModalModule.forRoot(),
    ModalModule.forRoot()
    ],
  providers: [ApiService, CookieService],
  bootstrap: [AppComponent]
})
export class AppModule { }
