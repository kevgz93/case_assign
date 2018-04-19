import { Component, OnInit } from '@angular/core';
import {ApiService} from '../api.service';
import { Observable } from 'rxjs/Observable';
import { NgModel } from '@angular/forms';
import {FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import {Router} from '@angular/router';
import {IMyDpOptions} from 'mydatepicker';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss']
})
export class ScheduleComponent implements OnInit {

  public myDatePickerOptions: IMyDpOptions = {
    // other options...
    dateFormat: 'dd/mm/yyyy',
};
  public data;
  public user;
  public mjs;
  private showcalen = false;
  myform: FormGroup;

  constructor(private service: ApiService, private fb: FormBuilder, private router:Router) { }

  getDifference(timezone, daylight){
    console.log("entry to daylight");
    let difference={"hour":0, "minutes":0};
    let dayL:number = 0;
    if(daylight){
      dayL = 1;
    }

    if(timezone === "cat"){
      difference.hour = 6;
    }
    else if(timezone === "pt"){
      difference.hour = 7 + dayL;
    }
    else if(timezone === "ct"){
      difference.hour = 5 + dayL;
    }
    else if(timezone === "et"){
      difference.hour = 4 + dayL;
    }
    else if(timezone === "et"){
      difference.hour = -1 + dayL;
    }
    else if(timezone === "uk"){
      difference.hour = 0 + dayL;
    }
    else if(timezone === "cet"){
      difference.hour = -1 + dayL;
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

    console.log("schedule ", data);
    this.service.addSchedule(data)
    .subscribe(msj => {
      console.log(msj);
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

  showCalendar():Boolean {
    this.showcalen = true;
    return
  }


  ngOnInit() {

    this.service.currentObject.subscribe(message => this.user = message);

    this.myform= this.fb.group({
      monday_morning: '',
      monday_afternoon: '',
      tuesday_morning: '',
      tuesday_afternoon : '',
      wednesday_morning: '',
      wednesday_afternoon: '',
      thursday_morning: '',
      thursday_afternoon: '',
      friday_morning: '',
      friday_afternoon: '',
      time:'',
      daylight: false
      //day_on:[null, Validators.required],
      //day_off: [null, Validators.required]

    });
    
  }

}
