import { Component, OnInit } from '@angular/core';
import {ApiService} from '../api.service';
import { Observable } from 'rxjs/Observable';
import { NgModel } from '@angular/forms';
import {FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import {Router} from '@angular/router';
import {IMyDpOptions} from 'mydatepicker';
import { MomentTimezoneModule } from 'moment-timezone';
declare var jquery:any;
declare var $ :any;

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss']
})
export class ScheduleComponent implements OnInit {

  public myDatePickerOptions: IMyDpOptions = {
    // other options...
    //dateFormat: 'dd/mm/yyyy',
};
  public data;
  public user;
  public mjs;
  private showcalen = false;
  myform: FormGroup;

  constructor(private service: ApiService, private fb: FormBuilder, private router:Router) { }

  isDaylight():Boolean {
    let moment = require('moment-timezone');
    let date = new Date();
    let NYDate = moment.tz(date, "America/New_York");
    let offset:number = NYDate._offset;
    if(offset != -300){
      return true;
    }
    
  }

  getDifference(timezone, daylight){
    let difference={"hour":0, "minutes":0};
    let dayL:number;

    var today = new Date();
    if (this.isDaylight()) { 
      dayL = 1;
    }

    if(timezone === "cat"){
      difference.hour = 6;
    }
    else if(timezone === "pt"){
      difference.hour = 8 - dayL;
    }
    else if(timezone === "ct"){
      difference.hour = 6 - dayL;
    }
    else if(timezone === "et"){
      difference.hour = 5 - dayL;
    }
    else if(timezone === "uk"){
      difference.hour = 0 - dayL;
    }
    else if(timezone === "cet"){
      difference.hour = -1 - dayL;
    }
    else if(timezone === "ist"){
      difference.hour = -5;
      difference.minutes = 30;
    }
    else if(timezone === "ict"){
      difference.hour = -7;
    }
    else if(timezone === "sgt"){
      difference.hour = -8;
    }
    else if(timezone === "jst"){
      difference.hour = -9;
    }
    return difference;
  }

  addSchedule(data){
    let difference = this.getDifference(data.time, data.daylight)
    data.user_id = this.user.user._id;
    data.difference = difference;
    //data.day_off = data.day_off.formatted;
    //data.day_on = data.day_on.formatted;

    this.service.addSchedule(data)
    .subscribe(msj => {
      if(msj.status == 201){
        alert('Schedule Added');
        this.router.navigate(['./home']);
        
      }
      else{
        alert('schedule Failed');
        this.router.navigate(['./schedule']);
      }
    })
    
  }


  ngOnInit() {

    this.service.currentObject.subscribe(message => this.user = message);

    this.myform= this.fb.group({
      monday_morning_hour : '',
      monday_morning_minutes : '',
      monday_afternoon_hour : '',
      monday_afternoon_minutes : '',
      tuesday_morning_hour: '',
      tuesday_morning_minutes: '',
      tuesday_afternoon_hour: '',
      tuesday_afternoon_minutes: '',
      wednesday_morning_hour: '',
      wednesday_morning_minutes: '',
      wednesday_afternoon_hour: '',
      wednesday_afternoon_minutes: '',
      thursday_morning_hour : '',
      thursday_morning_minutes : '',
      thursday_afternoon_hour : '',
      thursday_afternoon_minutes : '',
      friday_morning_hour: '',
      friday_morning_minutes: '',
      friday_afternoon_hour: '',
      friday_afternoon_minutes: '',
      time: '',
      daylight: false,
      day_off_day:0,
      day_off_month:0,
      day_off_hour:0,
      day_off_minutes:0,
      day_on_day:0,
      day_on_month:0,
      day_on_hour:0,
      day_on_minutes:0
      //day_on:[null, Validators.required],
      //day_off: [null, Validators.required]

    });
    $('#queue_monitors_tab').removeClass('active');
    
  }

}
