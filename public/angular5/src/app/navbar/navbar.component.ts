import { Component, OnInit } from '@angular/core';
import {ApiService} from '../api.service';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  public user;
  public show:boolean;

  constructor(private service: ApiService) { }

  checkSessionId(): Observable<any>{
    this.service.getUserBySessionId()
    .subscribe(user => {
      if(user.status != 201)
      {
        console.log("user not found");
      }
      else{
        this.show = true;
        this.user = user.body;

      }
      ;
    })
   
    return;
  }

  ngOnInit() {
    this.show = false;
    this.checkSessionId()

  }

}
