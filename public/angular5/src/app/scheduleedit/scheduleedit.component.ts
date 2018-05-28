import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { Observable } from 'rxjs/Observable';
import { NgModel } from '@angular/forms';
import { FormBuilder, FormGroup, Validators, FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
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
  private showhtml;
  private showdivcalendar;
  rForm: FormGroup;
  myform: FormGroup;

  constructor(private service: ApiService, private fb: FormBuilder, private router: Router) { }
  // get the time zone from the user
  getDifference(timezone, daylight) {
    console.log("entry to daylight");
    let difference = { "hour": 0, "minutes": 0 };
    let dayL: number = 0;
    if (daylight) {
      dayL = 1;
    }

    if (timezone === "cat") {
      difference.hour = 6;
    }
    else if (timezone === "pt") {
      difference.hour = 7 + dayL;
    }
    else if (timezone === "ct") {
      difference.hour = 5 + dayL;
    }
    else if (timezone === "et") {
      difference.hour = 4 + dayL;
    }
    else if (timezone === "uk") {
      difference.hour = 0 + dayL;
    }
    else if (timezone === "cet") {
      difference.hour = -1 + dayL;
    }
    else if (timezone === "ist") {
      difference.hour = -5;
      difference.minutes = 30;
    }
    else if (timezone === "ict") {
      difference.hour = -7;
    }
    else if (timezone === "sgt") {
      difference.hour = -8;
    }
    else if (timezone === "jst") {
      difference.hour = -9;
    }
    return difference;
  }

  //converting to the current timezone
  convertToTimeZone(schedule): void {
    let date = new Date;
    let difference = date.getTimezoneOffset() / 60;
    this.schedule.monday_morning.hour = schedule.monday_morning.hour - difference;
    this.schedule.monday_morning.minutes = schedule.monday_morning.minutes;
    this.schedule.monday_afternoon.hour = schedule.monday_afternoon.hour - difference;
    this.schedule.monday_afternoon.minutes = schedule.monday_afternoon.minutes;
    this.schedule.tuesday_morning.hour = schedule.tuesday_morning.hour - difference;
    this.schedule.tuesday_morning.minutes = schedule.tuesday_morning.minutes;
    this.schedule.tuesday_afternoon.hour = schedule.tuesday_afternoon.hour - difference;
    this.schedule.tuesday_afternoon.minutes = schedule.tuesday_afternoon.minutes;
    this.schedule.wednesday_morning.hour = schedule.wednesday_morning.hour - difference;
    this.schedule.wednesday_morning.minutes = schedule.wednesday_morning.minutes;
    this.schedule.wednesday_afternoon.hour = schedule.wednesday_afternoon.hour - difference;
    this.schedule.wednesday_afternoon.minutes = schedule.wednesday_afternoon.minutes;
    this.schedule.thursday_morning.hour = schedule.thursday_morning.hour - difference;
    this.schedule.thursday_morning.minutes = schedule.thursday_morning.minutes;
    this.schedule.thursday_afternoon.hour = schedule.thursday_afternoon.hour - difference;
    this.schedule.thursday_afternoon.minutes = schedule.thursday_afternoon.minutes;
    this.schedule.friday_morning.hour = schedule.friday_morning.hour - difference;
    this.schedule.friday_morning.minutes = schedule.friday_morning.minutes;
    this.schedule.friday_afternoon.hour = schedule.friday_afternoon.hour - difference;
    this.schedule.friday_afternoon.minutes = schedule.friday_afternoon.minutes;
    this.fillForm();
    this.showhtml = true;
    //console.log("convert to timezone", schedule);
    //let schedule_total = this.convertToString(schedule);
    // Object.keys(schedule).forEach(function(key) {
    //   console.log(key, schedule[key]);  
    // });
    //return schedule_total;
  }
  getSchedule(): Observable<object> {
    this.service.getSchedule(this.id)
      .subscribe(schedule => {
        if (schedule.status != 200) {
          alert("error finding user");
        }
        else {
          console.log("getSchedule", schedule)
          this.schedule = schedule.body;
          this.convertToTimeZone(schedule.body);

        }
      })

    return;
  }

  updateSchedule(data) {
    let difference = this.getDifference(data.time, data.daylight)
    data._id = this.id;
    data.difference = difference;
    this.service.updateSchedule(data)
      .subscribe(response => {
        console.log(response.status);
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

    console.log("Daylight: ", this.schedule.daylight);
  }

  getEngineer(): Observable<engineer> {
    this.service.getOneEngineer(this.id)
      .subscribe(user => {
        console.log(user);
        if (user.status != 200) {
          alert("error finding user");
        }
        else {
          this.user = user.body;
          //console.log("User: ", this.user);
        }
      })

    return;
  }

  ngOnInit() {
    this.showhtml = false;
    this.service.currentId.subscribe(message => this.id = message);
    this.getEngineer();
    this.getSchedule();
    $('#queue_monitors_tab').removeClass('active');
  }

}
