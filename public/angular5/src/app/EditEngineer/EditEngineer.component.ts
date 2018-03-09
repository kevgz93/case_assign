import { Component, OnInit } from '@angular/core';
import {ApiService} from '../api.service';
import { Observable } from 'rxjs/Observable';
import { NgModel } from '@angular/forms';
import {FormBuilder, FormGroup, Validators, FormControl, ReactiveFormsModule} from '@angular/forms';
import {Router} from '@angular/router';

interface engineer{
	name : String,
	last_name : String,
	username: String,
	password: String,
	email: String,
	city : String,
	time_zone: Number,
	sta_dyn: Number,
	max_case: Number,
	status: Boolean,
	activeSession: String,
	role: String,
	days_working: Number,
	last_case: String
};

@Component({
  selector: 'app-engineer',
  templateUrl: './EditEngineer.component.html',
  styleUrls: ['./EditEngineer.component.scss']
})



export class EngineerComponent implements OnInit {

  public id;
  public user;
  private showhtml;
  rForm: FormGroup;
  myform: FormGroup;
  
  

  constructor(private service: ApiService, private fb: FormBuilder, private router:Router) { 

  }


  getOneSchedule(): Observable<engineer>{
    this.service.getOneEngineer(this.id)
    .subscribe(user => {
      console.log(user);
      if(user.status != 200){
        alert("error finding user");
      }
      else{
        this.user = user;
        this.fillForm();
        this.showhtml = true;
      }
})
    
    return;
  }

  updateUser(data){
    data._id = this.id;
    this.service.updateUser(data)
    .subscribe(response => {
      console.log(response.status);
      if(response.status != 204){
        alert("error finding user");
      }
      else{
        alert("User updated");
        this.router.navigate(['./home'])
      }
  })

  return;
}

  fillForm(){

    this.myform= this.fb.group({
      name: this.user.body.name,
      last_name: this.user.body.last_name,
      email: this.user.body.email,
      city : this.user.body.city,
      time: this.user.body.time_zone,
      sta_dyn: this.user.body.sta_dyn,
      max: this.user.body.max_case,
      status: this.user.body.status,
      role: this.user.body.role,
      username: this.user.body.username,
      password: this.user.body.password,
    });
  }

  ngOnInit() {
    this.showhtml = false;
    this.service.currentId.subscribe(message => this.id = message);
    this.getOneSchedule();

  }

}
