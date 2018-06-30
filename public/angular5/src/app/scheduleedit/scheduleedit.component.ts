import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { Observable } from 'rxjs/Observable';
import { NgModel } from '@angular/forms';
import { FormBuilder, FormGroup, Validators, FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {ConvertTimeZero} from './../lib/Time_zero'
declare var jquery: any;
declare var $: any;

interface engineer {
  name: String,
  last_name: String,
  username: String,
  password: String,
  email: String,
  city: String,
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
  selector: 'app-scheduleedit',
  templateUrl: './scheduleedit.component.html',
  styleUrls: ['./scheduleedit.component.scss']
})
export class ScheduleeditComponent implements OnInit {

  public id;
  public schedule; //{"monday_morning":{"hour":0,"minutes":0}, "monday_afternoon":{"hour":0,"minutes":0},"tuesday_morning":{"hour":0,"minutes":0},"tuesday_afternoon":{"hour":0,"minutes":0},
  // "wednesday_morning":{"hour":0,"minutes":0},"wednesday_afternoon":{"hour":0,"minutes":0},"thursday_morning":{"hour":0,"minutes":0},"thursday_afternoon":{"hour":0,"minutes":0},"friday_morning":{"hour":0,"minutes":0},
  // "friday_afternoon":{"hour":0,"minutes":0}}
  public user; // Information of the owner of the schedule
  private showhtml:boolean = false;
  private showdivcalendar;
  //create instance on lib folder
  private convertTimeZone = new ConvertTimeZero();
  rForm: FormGroup;
  myform: FormGroup;


  // click on cancel button
  cancelForm(){
    this.router.navigate(['./editusers']);
  }

  constructor(private service: ApiService, private fb: FormBuilder, private router: Router) { }


  //converting to the current timezone
  convertToTimeZone(schedule): void {
    
    this.schedule = this.convertTimeZone.convertFromTimeZero(schedule);
    console.log(this.schedule);

    this.fillForm();
  }

  getSchedule(): Observable<object> {
    this.service.getSchedule(this.id)
      .subscribe(schedule => {
        if (schedule.status != 200) {
          alert("error finding user");
        }
        else {
          this.schedule = schedule.body;
          this.convertToTimeZone(schedule.body);

        }
      })

    return;
  }

  updateSchedule(data) {
    let difference = this.convertTimeZone.getDifference(data.time)
    data._id = this.id;
    data.difference = difference;
    this.service.updateSchedule(data)
      .subscribe(response => {
        if (response.status != 204) {
          alert("error finding user");
        }
        else {
          alert("Schedule updated");
          this.router.navigate(['./home'])
        }
      })

    return;
  }

  showCalendar(): Boolean {
    if (this)// incomplete
      this.showdivcalendar = true;
    return
  }

  fillForm() {

    this.myform = this.fb.group({

      monday_morning_hour: this.schedule.monday_morning.hour,
      monday_morning_minutes: this.schedule.monday_morning.minutes,
      monday_afternoon_hour: this.schedule.monday_afternoon.hour,
      monday_afternoon_minutes: this.schedule.monday_afternoon.minutes,
      tuesday_morning_hour: this.schedule.tuesday_morning.hour,
      tuesday_morning_minutes: this.schedule.tuesday_morning.minutes,
      tuesday_afternoon_hour: this.schedule.tuesday_afternoon.hour,
      tuesday_afternoon_minutes: this.schedule.tuesday_afternoon.minutes,
      wednesday_morning_hour: this.schedule.wednesday_morning.hour,
      wednesday_morning_minutes: this.schedule.wednesday_morning.minutes,
      wednesday_afternoon_hour: this.schedule.wednesday_afternoon.hour,
      wednesday_afternoon_minutes: this.schedule.wednesday_afternoon.minutes,
      thursday_morning_hour: this.schedule.thursday_morning.hour,
      thursday_morning_minutes: this.schedule.thursday_morning.minutes,
      thursday_afternoon_hour: this.schedule.thursday_afternoon.hour,
      thursday_afternoon_minutes: this.schedule.thursday_afternoon.minutes,
      friday_morning_hour: this.schedule.friday_morning.hour,
      friday_morning_minutes: this.schedule.friday_morning.minutes,
      friday_afternoon_hour: this.schedule.friday_afternoon.hour,
      friday_afternoon_minutes: this.schedule.friday_afternoon.minutes,
      time: this.schedule.time_zone,
      daylight: this.schedule.daylight,
     
      // day_off: this.schedule.day_off,
      // day_on : this.schedule.day_on,
    });
    this.showhtml = true;
  }

  getEngineer(): Observable<engineer> {
    this.service.getOneEngineer(this.id)
      .subscribe(user => {
        if (user.status != 200) {
          alert("error finding user");
        }
        else {
          this.user = user.body;
        }
      })

    return;
  }

  ngOnInit() {
    this.service.currentId.subscribe(message => this.id = message);
    this.getEngineer();
    this.getSchedule();
    $('#queue_monitors_tab').removeClass('active');
  }

}
