import { Component, OnInit } from '@angular/core';
import {ApiService} from '../api.service';
import { Observable } from 'rxjs/Observable';
import { NgModel } from '@angular/forms';
import {FormBuilder, FormGroup, Validators, FormControl, ReactiveFormsModule} from '@angular/forms';
import {Router} from '@angular/router';

@Component({
  selector: 'app-scheduleshow',
  templateUrl: './scheduleshow.component.html',
  styleUrls: ['./scheduleshow.component.scss']
})
export class ScheduleshowComponent implements OnInit {


  public schedule;
  public aux;
  public showschedule:Boolean = false;
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
  convertToString(schedule):Observable<object>{
    console.log("convert to string", schedule);
    let minutes;
    let schedule_total;
    minutes = this.checkMinutes(schedule.monday_morning.minutes);
    schedule_total.monday_morning = `${this.aux.monday_morning.hour}:${minutes}`;
    minutes = this.checkMinutes(schedule.monday_afternoon.minutes);
    schedule_total.monday_afternoon = `${this.aux.monday_afternoon.hour}:${minutes}`;
    minutes = this.checkMinutes(schedule.tuesday_morning.minutes);
    schedule_total.tuesday_morning = `${this.aux.tuesday_morning.hour}:${minutes}`;
    minutes = this.checkMinutes(schedule.tuesday_afternoon.minutes);
    schedule_total.tuesday_afternoon = `${this.aux.tuesday_afternoon.hour}:${minutes}`;
    minutes = this.checkMinutes(schedule.wednesday_morning.minutes);
    schedule_total.wednesday_morning = `${this.aux.wednesday_morning.hour}:${minutes}`;
    minutes = this.checkMinutes(schedule.wednesday_afternoon.minutes);
    schedule_total.wednesday_afternoon = `${this.aux.wednesday_afternoon.hour}:${minutes}`;
    minutes = this.checkMinutes(schedule.thursday_morning.minutes);
    schedule_total.thursday_morning = `${this.aux.thursday_morning.hour}:${minutes}`;
    minutes = this.checkMinutes(schedule.thursday_afternoon.minutes);
    schedule_total.thursday_afternoon = `${this.aux.thursday_afternoon.hour}:${minutes}`;
    minutes = this.checkMinutes(schedule.friday_morning.minutes);
    schedule_total.friday_morning = `${this.aux.friday_morning.hour}:${minutes}`;
    minutes = this.checkMinutes(schedule.friday_afternoon.minutes);
    schedule_total.friday_afternoon = `${this.aux.friday_afternoon.hour}:${minutes}`;
    console.log(this.schedule);
    return schedule_total;
    //this.showschedule = true;

  }

  //converting to the current timezone
  convertToTimeZone(schedule):Observable<object>{
    //console.log("convert to timezone", schedule);
    let date = new Date;
    let difference = date.getTimezoneOffset();
    this.aux.monday_morning.hour = schedule.monday_morning.hour - difference;
    this.aux.monday_afternoon.hour = schedule.monday_afternoon.hour - difference;
    this.aux.tuesday_morning.hour = schedule.tuesday_morning.hour - difference;
    this.aux.tuesday_afternoon.hour = schedule.tuesday_afternoon.hour - difference;
    this.aux.wednesday_morning.hour = schedule.wednesday_morning.hour - difference;
    this.aux.wednesday_afternoon.hour = schedule.wednesday_afternoon.hour - difference;
    this.aux.thursday_morning.hour = schedule.thursday_morning.hour - difference;
    this.aux.thursday_afternoon.hour = schedule.thursday_afternoon.hour - difference;
    this.aux.friday_morning.hour = schedule.friday_morning.hour - difference;
    this.aux.friday_afternoon.hour = schedule.friday_afternoon.hour - difference;
    this.convertToString(schedule).subscribe(schedule_total =>{
      return schedule_total;
    });
    // Object.keys(schedule).forEach(function(key) {
    //   console.log(key, schedule[key]);  
    // });
    return;
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
         this.convertToTimeZone(schedule).subscribe(msg => {
           console.log("final de la linea",msg);
          this.schedule = msg;
          //this.showschedule = true;
         });
         //this.showschedule = true;
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
