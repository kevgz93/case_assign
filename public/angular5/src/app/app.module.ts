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
import { AddengineerComponent } from './addengineer/addengineer.component';
import { LoginComponent } from './login/login.component';
import { CookieService } from 'ngx-cookie-service';
<<<<<<< HEAD
import { RegisterComponent } from './register/register.component';
=======
>>>>>>> 5991c7e41631c0eeebe613da644eb47bb119f3d4


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    EngineerComponent,
    AddengineerComponent,
<<<<<<< HEAD
    LoginComponent,
    RegisterComponent
=======
    LoginComponent
>>>>>>> 5991c7e41631c0eeebe613da644eb47bb119f3d4
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
    ],
  providers: [ApiService, CookieService],
  bootstrap: [AppComponent]
})
export class AppModule { }
