import { Component, OnInit } from '@angular/core';
import {ApiService} from '../api.service';
import { Observable } from 'rxjs/Observable';
import { NgModel } from '@angular/forms';
import {FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import {Router} from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
//import * as CryptoJs from 'crypto-js';
import * as sjcl from 'sjcl';


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
  public msg:any = {"status":false, "msg":""};
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
    let password = user.password;
    var out = sjcl.hash.sha256.hash(password);
    user.password = sjcl.codec.hex.fromBits(out);
    this.service.login(user)
    .subscribe(response =>{
      let status: any = response.status;
      if(status === 'success'){
        this.createCookie(response);
        this.service.changeUserId("login");
        this.msg.status = true;
        //this.router.navigate(['./navbar']);
        window.location.replace('/home');

    }

    else{
      this.msg.status = true;
      this.msg.msg="Invalid Username or Password";
    }

    });



  }


}
