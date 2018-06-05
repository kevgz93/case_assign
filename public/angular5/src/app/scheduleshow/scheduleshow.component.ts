import { Component, OnInit } from '@angular/core';
import {ApiService} from '../api.service';
import { Observable } from 'rxjs/Observable';
import { NgModel } from '@angular/forms';
import {FormBuilder, FormGroup, Validators, FormControl, ReactiveFormsModule} from '@angular/forms';
import {Router} from '@angular/router';
import { promise } from 'protractor';
import {IMyDrpOptions, MYDRP_VALUE_ACCESSOR} from 'mydaterangepicker';
declare var jquery:any;
declare var $ :any;

@Component({
  selector: 'app-scheduleshow',
  templateUrl: './scheduleshow.component.html',
  styleUrls: ['./scheduleshow.component.scss']
})
export class ScheduleshowComponent implements OnInit {

  public showview:Boolean = false;
  public schedule;
  private showcalendar:Boolean = false;
  public aux = {"monday_morning":0, "monday_afternoon":0,"tuesday_morning":0,"tuesday_afternoon":0,
  "wednesday_morning":0,"wednesday_afternoon":0,"thursday_morning":0,"thursday_afternoon":0,"friday_morning":0,
  "friday_afternoon":0};
  private id;
  private myform: FormGroup;
  public myDateRangePickerOptions: IMyDrpOptions = {
    // other options...
    dateFormat: 'dd/mm/yyyy',
};


  constructor(private service: ApiService, private fb: FormBuilder, private router:Router) { }

  //minutes on 00 or 30
  checkMinutes(minutes):string{
    if (minutes != 0){
      return `${minutes}`;
    }
    return `${minutes}0`;
  }

  //convert to string to show on the html
  convertToString(schedule):object{
    let minutes;
    let schedule_total = {"monday_morning": '' , "monday_afternoon":'' ,"tuesday_morning":'' ,"tuesday_afternoon":'' ,
    "wednesday_morning":'' ,"wednesday_afternoon":'' ,"thursday_morning":'' ,"thursday_afternoon":'' ,"friday_morning":'' ,
    "friday_afternoon":'' };
    minutes = this.checkMinutes(schedule.monday_morning.minutes);
    schedule_total.monday_morning = `${this.aux.monday_morning}:${minutes}`;
    minutes = this.checkMinutes(schedule.monday_afternoon.minutes);
    schedule_total.monday_afternoon = `${this.aux.monday_afternoon}:${minutes}`;
    minutes = this.checkMinutes(schedule.tuesday_morning.minutes);
    schedule_total.tuesday_morning = `${this.aux.tuesday_morning}:${minutes}`;
    minutes = this.checkMinutes(schedule.tuesday_afternoon.minutes);
    schedule_total.tuesday_afternoon = `${this.aux.tuesday_afternoon}:${minutes}`;
    minutes = this.checkMinutes(schedule.wednesday_morning.minutes);
    schedule_total.wednesday_morning = `${this.aux.wednesday_morning}:${minutes}`;
    minutes = this.checkMinutes(schedule.wednesday_afternoon.minutes);
    schedule_total.wednesday_afternoon = `${this.aux.wednesday_afternoon}:${minutes}`;
    minutes = this.checkMinutes(schedule.thursday_morning.minutes);
    schedule_total.thursday_morning = `${this.aux.thursday_morning}:${minutes}`;
    minutes = this.checkMinutes(schedule.thursday_afternoon.minutes);
    schedule_total.thursday_afternoon = `${this.aux.thursday_afternoon}:${minutes}`;
    minutes = this.checkMinutes(schedule.friday_morning.minutes);
    schedule_total.friday_morning = `${this.aux.friday_morning}:${minutes}`;
    minutes = this.checkMinutes(schedule.friday_afternoon.minutes);
    schedule_total.friday_afternoon = `${this.aux.friday_afternoon}:${minutes}`;
    return schedule_total;
    //this.showschedule = true;

  }

  //converting to the current timezone
  convertToTimeZone(schedule):object{
    let date = new Date;
    let difference = date.getTimezoneOffset() / 60;
    this.aux.monday_morning = schedule.monday_morning.hour - difference;
    
    this.aux.monday_afternoon = schedule.monday_afternoon.hour - difference;
    this.aux.tuesday_morning = schedule.tuesday_morning.hour - difference;
    this.aux.tuesday_afternoon = schedule.tuesday_afternoon.hour - difference;
    this.aux.wednesday_morning = schedule.wednesday_morning.hour - difference;
    this.aux.wednesday_afternoon = schedule.wednesday_afternoon.hour - difference;
    this.aux.thursday_morning = schedule.thursday_morning.hour - difference;
    this.aux.thursday_afternoon = schedule.thursday_afternoon.hour - difference;
    this.aux.friday_morning = schedule.friday_morning.hour - difference;
    this.aux.friday_afternoon = schedule.friday_afternoon.hour - difference;
    let schedule_total = this.convertToString(schedule);
    // Object.keys(schedule).forEach(function(key) {
    // });
    return schedule_total;
  }

//get the schedule
  getSchedule(): Observable<object>{
    this.service.getSchedule(this.id)
    .subscribe(schedule => {
      if(schedule.status != 200){
        alert("error finding user");
      }
      else{
         //this.schedule = schedule.body;
         this.schedule = this.convertToTimeZone(schedule.body);
         this.showview = true;
      }
     
    })
    
    return;
  }

  //add the timeZone from calendars
  addTimeOff(data): Observable<object>{
    let sendData = {"_id":"","day_off":{"day":0, "month":0, "hour":0, "minutes":0}, 
    "day_on":{"day":0, "month":0, "hour":0, "minutes":0}};
    sendData._id = this.id;
    sendData.day_off.day = data.myDateRange.beginDate.day;
    sendData.day_off.month = data.myDateRange.beginDate.month;
    sendData.day_off.hour = parseInt(data.start_time_hour);
    sendData.day_off.minutes = parseInt(data.start_time_minutes);
    sendData.day_on.day = data.myDateRange.endDate.day;
    sendData.day_on.month = data.myDateRange.endDate.month;
    sendData.day_on.hour = parseInt(data.end_time_hour);
    sendData.day_on.minutes = parseInt(data.end_time_minutes);
    this.service.addTimeOff(sendData)
    .subscribe(response => {
      if(response.status === 204){
        alert("Time off added");
        this.router.navigate(['./home'])
      }
      else{
        alert("Time off not added, please contact your administrator")
      }
    })
    return
  }

 //set time for calendar
 setDateRange(): void {
  // Set date range (today) using the patchValue function
  let date = new Date();
  this.myform.patchValue({
    myDateRange: {
      beginDate: {
          year: date.getFullYear(),
          month: date.getMonth() + 1,
          day: date.getDate()
      },
      endDate: {
          year: date.getFullYear(),
          month: date.getMonth() + 1,
          day: date.getDate()
      }
      

  },
      start_time_hour:0,
      start_time_minutes: 0,
      end_time_hour:0,
      end_time_minutes: 0
    });
}

//show calendar from checkbox
changeview(value):void{
  this.showcalendar = value;
}

  ngOnInit() {
    this.myform = this.fb.group({

      myDateRange: ['', Validators.required],
      start_time_hour:['', Validators.required],
      start_time_minutes: ['', Validators.required],
      end_time_hour:['', Validators.required],
      end_time_minutes: ['', Validators.required]

  });
    this.service.currentId.subscribe(message => this.id = message);
    this.getSchedule();
    $('#queue_monitors_tab').removeClass('active');
  }

}
