import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { CookieService } from 'ngx-cookie-service';
import { ApiService } from '../api.service';
import * as sjcl from 'sjcl';

declare var jquery:any;
declare var $ :any;

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
}

@Component({
  selector: 'app-engineer',
  templateUrl: './EditEngineer.component.html',
  styleUrls: ['./EditEngineer.component.scss']
})



export class EngineerComponent implements OnInit {

  // Variables
  public id;
  public user;
  private showform: boolean = false;
  private current_user_role;
  private myform: FormGroup;
  private weekendRotationForm: FormGroup;


  // Constructor
  constructor(private service: ApiService,
              private fb: FormBuilder,
              private router:Router,
              private cookieService: CookieService,
              private _location: Location) {}

  // Class functions
  cancelForm(){
    this._location.back();
  }

  // Function: getOneEngineer
  // Action: Get the information of the engineer using the id from the Serve
  getOneEngineer(): Observable<engineer>{
    if (this.id === "") {
      this.id = "5b218a953c69020cfa63b61f";
    }
    this.service.getOneEngineer(this.id)
      .subscribe(user => {
        if(user.status != 200){
          alert("error finding user");
        }
        else{
          this.user = user;
          this.fillForm();
          this.fillWeekendRotationForm();
        }
      });
    return;
  }

  updateUser(data){
    data._id = this.id;
    data.max = +data.max;
    if (data.password != this.user.body.password){
      let password = data.password;
      let out = sjcl.hash.sha256.hash(password);
      data.password = sjcl.codec.hex.fromBits(out);
    }

    /*
        switch(data.sta_dyn){
            case "Both":
            data.sta_dyn = 3;
            break;
            case "Dynamic":
            data.sta_dyn = 2;
            break;
            case "Static":
            data.sta_dyn = 1;
            break;
            default:
            data.sta_dyn = 3;
            break;
        }
        data.status = data.status == "Available" ? true : false;
        data.role = data.role.toLowerCase();  // Changes Admin -> admin or User -> user
        */
    console.log(data);
    this.service.updateUser(data)
      .subscribe(response => {
        if(response.status != 204){
          alert("error finding user");
        }
        else{
          alert("User updated");
          this.router.navigate(['./home'])
        }
      });

    return;
  }

  fillForm(){

    let sta_dyn_tmp = this.user.body.sta_dyn; // Change to "" if enabling the option bellow.
    /*
        var sta_dyn_tmp = "";
        switch(this.user.body.sta_dyn){
            case 1:
            sta_dyn_tmp = "Static";
            break;
            case 2:
            sta_dyn_tmp = "Dynamic";
            break;
            case 3:
            sta_dyn_tmp = "Both";
            break;
        }*/

    //var status_tmp = this.user.body.status ? "Available" : "Disable"
    let status_tmp = this.user.body.status;
    //var role_tmp = this.user.body.role == "admin" ? "Admin" : "User";
    let role_tmp = this.user.body.role;
    this.myform= this.fb.group({
      name: this.user.body.name,
      last_name: this.user.body.last_name,
      email: this.user.body.email,
      city : this.user.body.city,
      sta_dyn: sta_dyn_tmp,
      max: this.user.body.max_case,
      status: status_tmp,
      role: role_tmp,
      username: this.user.body.username,
      password: this.user.body.password
    });
  }

  getUserRole(){
    let cookie = this.cookieService.get('SessionId');
    if(!cookie){
      this.router.navigate(['./home'])
    }
    else{
      this.service.getUserBySessionId().subscribe(response =>{
        if(response.status != 201) {
          this.router.navigate(['./home'])
        }
        else{
          this.current_user_role = response.body;
          this.showform = true;
        }
      });
    }
  }

  fillWeekendRotationForm(){
    this.weekendRotationForm = this.fb.group({
      weekendRotationDates: this.fb.array([])
    });
    this.setUserWeekendRotationDates();
  }

  setUserWeekendRotationDates(): FormArray {
    const addressFGs = this.user.body.weekendRotationDates.map(dates => this.fb.group(dates));
    const addressFormArray = this.fb.array(addressFGs);
    this.weekendRotationForm.setControl('weekendRotationDates', addressFormArray);
    return this.weekendRotationForm.get('weekendRotationDates') as FormArray;
  };

  get userWeekendRotationDates(): FormArray {
    return this.weekendRotationForm.get('weekendRotationDates') as FormArray;
  };

  addDate() {
    this.userWeekendRotationDates.push(this.fb.group({"date": new Date}));
  }

  removeDate(i: number) {
    this.userWeekendRotationDates.removeAt(i);
  }

  updateUserWRDates(data) {
    this.user.body.weekendRotationDates = data.weekendRotationDates;
    console.log(this.user.body);
    this.service.updateUserWRDates(this.user.body)
      .subscribe(response => {
        if(response.status != 204){
          alert("error finding user");
        }
        else{
          alert("User updated");
          this.router.navigate(['./home'])
        }
      });

    return;
  }


  ngOnInit() {
    this.service.currentId.subscribe(message => this.id = message);
    this.getOneEngineer();
    this.getUserRole();
    $('#queue_monitors_tab').removeClass('active');
  }

}
