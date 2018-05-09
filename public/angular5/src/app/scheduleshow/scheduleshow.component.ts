import { Component, OnInit } from '@angular/core';
import {ApiService} from '../api.service';
import { Observable } from 'rxjs/Observable';
import { NgModel } from '@angular/forms';
import {FormBuilder, FormGroup, Validators, FormControl, ReactiveFormsModule} from '@angular/forms';
import {Router} from '@angular/router';
import { promise } from 'protractor';

@Component({
  selector: 'app-scheduleshow',
  templateUrl: './scheduleshow.component.html',
  styleUrls: ['./scheduleshow.component.scss']
})
export class ScheduleshowComponent implements OnInit {

  public showschedule:Boolean;
  public schedule;
  public aux = {"monday_morning":0, "monday_afternoon":0,"tuesday_morning":0,"tuesday_afternoon":0,
  "wednesday_morning":0,"wednesday_afternoon":0,"thursday_morning":0,"thursday_afternoon":0,"friday_morning":0,
  "friday_afternoon":0};
  private id;

  constructor(private service: ApiService, private router:Router) { }

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
    console.log('convert to string',schedule_total);
    return schedule_total;
    //this.showschedule = true;

  }

  //converting to the current timezone
  convertToTimeZone(schedule):object{
    console.log("convert to timezone", schedule);
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
    //console.log("convert to timezone", schedule);
    let schedule_total = this.convertToString(schedule);
    // Object.keys(schedule).forEach(function(key) {
    //   console.log(key, schedule[key]);  
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
        console.log(schedule);
         //this.schedule = schedule.body;
         this.schedule = this.convertToTimeZone(schedule.body);
         this.showschedule = true;
      }
     
    })
    
    return;
  }


  ngOnInit() {
    this.showschedule = false;
    this.service.currentId.subscribe(message => this.id = message);
    this.getSchedule();
  }

}
