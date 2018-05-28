import { Component, OnInit } from '@angular/core';
import {ApiService} from '../api.service';
import { Observable } from 'rxjs/Observable';
import { NgModel } from '@angular/forms';
import {FormBuilder, FormGroup, Validators, FormControl, ReactiveFormsModule} from '@angular/forms';
import {Router} from '@angular/router';
import { promise } from 'protractor';
declare var jquery:any;
declare var $ :any;

@Component({
  selector: 'app-editusers',
  templateUrl: './editusers.component.html',
  styleUrls: ['./editusers.component.scss']
})
export class EditusersComponent implements OnInit {
  private users;
  private showtable:Boolean=false;

  constructor(private service: ApiService, private router:Router) { }

  getUsers(): Observable<object>{
    this.service.getAllUsers()
    .subscribe(users => {
        console.log(users);
         //this.schedule = schedule.body;
         this.users = users;
         this.showtable = true;
     
    })
    return;
  }
  goToUser(id){
    console.log(id)
    this.service.changeUserId(id);
    this.router.navigate(['./editengineer'])
  }

  //Delete User
  deleteUser(id){
    console.log(id)
    this.service.deleteOneUser(id)
    .subscribe(response =>{
      if(response.status != 204){
        alert("User not deleted")
      }
      else{
        this.getUsers();
      }
    });
    
  }

  goToSchedule(id){
    console.log(id)
    this.service.changeUserId(id);
    this.router.navigate(['./editschedule'])
  }

  ngOnInit() {
    this.getUsers();
    $('#queue_monitors_tab').removeClass('active');
  }

}
