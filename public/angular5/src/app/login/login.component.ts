import { Component, OnInit } from '@angular/core';
import {ApiService} from '../api.service';
import { Observable } from 'rxjs/Observable';
import { NgModel } from '@angular/forms';
import {FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import {Router} from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loading:any = false;
  returnUrl: string;
  public user;
  loginform: FormGroup;
  public date: Date = new Date();

  constructor( private service: ApiService, private fb: FormBuilder, private router:Router,
    private cookieService: CookieService){
    }

    cookieValue:CookieService;

  ngOnInit() {
    this.loginform= this.fb.group({
      username: '',
      password: '',
    });

  }
  createCookie(sessionid): Observable<String>{
    this.cookieService.set( 'SessionId', sessionid.sessionid, 1);
    return;
  }



  login(user) {
    let sessionid: any;
    console.log(user);
    this.service.login(user)
    .subscribe(response =>{
      console.log(response);

      let status: any = response.status;
      if(status === 'success'){
        this.createCookie(response);
        this.service.changeUserId("login");
        console.log("entro para intercambiar user");
        //this.router.navigate(['./navbar']);
        window.location.replace('/home');

    }

    });



  }


}
