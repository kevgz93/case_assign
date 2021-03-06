import { Component, OnInit } from '@angular/core';
import {ApiService} from '../api.service';
import { Observable } from 'rxjs/Observable';
import { NgModel } from '@angular/forms';
import {FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import {Router} from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  public data;
  public mjs;
  myform: FormGroup;
  message:Object;

  constructor(private service: ApiService, private fb: FormBuilder, private router:Router) { }

  addUser(data){
    data.time = +data.time;
    data.sta_dyn = +data.sta_dyn;
    data.max = +data.max;

    console.log(data);
    this.service.addUser(data)
    .subscribe(msj => {
      console.log(msj);
      if(msj.status == 201){
        alert('User Added');
        this.service.changeObject(msj);
        this.router.navigate(['./schedule']);
        
      }
      else{
        alert('User Failed');
        this.router.navigate(['./login/register']);
      }
    })
    
  }

  ngOnInit() {
    this.myform= this.fb.group({
      name: '',
      last_name: '',
      email: '',
      city : '',
      sta_dyn: '',
      max: '',
      status: '',
      role: '',
      username: '',
      password: '',
    });
  }

}
