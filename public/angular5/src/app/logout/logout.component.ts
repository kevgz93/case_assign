import { Component, OnInit } from '@angular/core';
import {ApiService} from '../api.service';
import { Observable } from 'rxjs/Observable';
import { NgModel } from '@angular/forms';
import {FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import {Router} from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent implements OnInit {

  constructor(private service: ApiService, private router:Router,
    private cookieService: CookieService) { }

  ngOnInit() {
    this.service.logout()
    .subscribe(response =>{
      console.log(response);
      
      let status: any = response.status;
      if(status === 'success'){
        alert('logout suceessful')
        this.cookieService.delete('SessionId');
        window.location.replace('/login');

    }

  });
    
    
  }

}
