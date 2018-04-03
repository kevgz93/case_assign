import { Component, OnInit } from '@angular/core';
import {ApiService} from '../api.service';
import { Observable } from 'rxjs/Observable';
import {Router} from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  public user;
  private showMaintenance = false;
  public shownav:boolean = false;
  private cookie;

  constructor(private service: ApiService, private router:Router, private cookieService: CookieService) { }

  checkSessionId(login){
    let cookie = this.cookieService.get('SessionId');
    let url;
    if(!cookie){
      this.shownav = false;
      url = "login";
      this.redirect(url);
    }
      else{
        this.service.getUserBySessionId().subscribe(response =>{
          console.log("when check session on navbar",response);
          
          this.user = response.body;
          this.shownav = true;
          if (this.user.role === 'admin'){
            this.showMaintenance = true;
          }
          
         
        });
    }
    

  }

  redirect(url){
    if(url === 'login')
    this.router.navigate(['/'+url]);
    else if(url === 'home'){
      
      this.router.navigate([url]);
    }
    return
  }

  goHome(){
    this.router.navigate(['./home'])
    return
  }

  goReport(){
    this.router.navigate(['./report'])
    return
  }

  goAddUser(){
    this.router.navigate(['./login/register'])
    return
  }

  goEditUser(){
    this.user._id;
    this.service.changeUserId(this.user._id);
    this.router.navigate(['./edituser'])
    return
  }

  goEditSchedule(){
    this.user._id;
    this.service.changeUserId(this.user._id);
    this.router.navigate(['./editschedule'])
    return
  }

  goLogout(){
    this.router.navigate(['./logout'])
    return
  }

  ngOnInit() {
    let login;
    this.service.currentId.subscribe(message => login = message);
    //this.shownav = true;
    this.checkSessionId(login);
    
    
  }
}


