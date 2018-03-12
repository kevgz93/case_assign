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
  public show:boolean;
  private cookie;

  constructor(private service: ApiService, private router:Router, private cookieService: CookieService) { }

  checkSessionId(){
    let cookie = this.cookieService.get('SessionId');
    console.log("cookie", cookie);
    console.log("session id", this.user.sessionid);
    if (this.user.sessionid != cookie) 
    {
      this.router.navigate(['./login'])
    }
    else{
      this.show = true;
    }
  }

  goHome(){
    this.router.navigate(['./home'])
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

  ngOnInit() {
    this.show = false;
    this.service.currentObject.subscribe(message => {
      this.user = message;
      console.log("mensaje recibido ", this.user);
      this.checkSessionId();
      setTimeout(() => 
      {
        this.router.navigate(['./home']);

      },
      1300);

    });
    

  }

}
