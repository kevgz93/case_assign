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

  login(user) {
    console.log(user);
    this.service.login(user)
    .subscribe(response =>{
      console.log(response);
      let status: any = response.status;
      if(status === 'success'){
        console.log(response);
        this.router.navigate(['./home'])
      }
      else{
        console.log('error');
        this.router.navigate(['./login'])
      }
    })
  }


}
