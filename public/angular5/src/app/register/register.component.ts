import { Component, OnInit } from '@angular/core';
import {ApiService} from '../api.service';
import { Observable } from 'rxjs/Observable';
import { NgModel } from '@angular/forms';
import {FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import {Router} from '@angular/router';
declare var jquery:any;
declare var $ :any;

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
    data.max = +data.max;

    /*
    switch(data.sta_dyn){
      case "Both":
      data.sta_dyn = "3";
      break;
      case "Dynamic":
      data.sta_dyn = "2";
      break;
      case "Static":
      data.sta_dyn = "1";
      break;
    }
    data.status = data.status == "Available" ? "true" : "false";
    data.role = data.role.toLowerCase();  // Changes Admin -> admin or User -> user
    */

    //console.log(data.sta_dyn);
    //console.log(data.status);
    //console.log(data.role);
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

  // click on cancel button
  cancelForm(){
    this.router.navigate(['./']);
  }

  ngOnInit() {
    this.myform= this.fb.group({
      name: '',
      last_name: '',
      email: '',
      city : '',
      sta_dyn: '',
      max: '0',
      status: '',
      role: '',
      username: '',
      password: '',
    });
    $('#queue_monitors_tab').removeClass('active');
  }

}
