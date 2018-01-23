import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
<<<<<<< HEAD
import { RegisterComponent } from './register/register.component';
=======
>>>>>>> 5991c7e41631c0eeebe613da644eb47bb119f3d4

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
<<<<<<< HEAD
  { path: 'home', component: HomeComponent },
  { path: 'login/register', component: RegisterComponent }
=======
  { path: 'home', component: HomeComponent }
>>>>>>> 5991c7e41631c0eeebe613da644eb47bb119f3d4
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
