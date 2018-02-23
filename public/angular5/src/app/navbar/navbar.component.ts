import { Component, OnInit } from '@angular/core';
import {ApiService} from '../api.service';
import { Observable } from 'rxjs/Observable';
import {Router} from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  public user;
  public show:boolean;

  constructor(private service: ApiService, private router:Router) { }

  checkSessionId(): Observable<any>{
    this.service.getUserBySessionId()
    .subscribe(user => {
      console.log("user", user);
      if(user.status != 201)
      {
        this.router.navigate(['./login'])
        
      }
      else{
        console.log(user.status);
        this.user = user;
        this.show = true;

      }
      ;
    })
   
    return;
  }

  goHome(){
    this.router.navigate(['./home'])
    return
  }

  goAddUser(){
    this.router.navigate(['./login/register'])
    return
  }

  ngOnInit() {
    this.show = false;
    this.checkSessionId()

  }

}
