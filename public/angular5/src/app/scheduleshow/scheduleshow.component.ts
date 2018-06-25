import { Component, OnInit, TemplateRef } from '@angular/core';
import {ApiService} from '../api.service';
import { Observable } from 'rxjs/Observable';
import { NgModel } from '@angular/forms';
import {FormBuilder, FormGroup, Validators, FormControl, ReactiveFormsModule} from '@angular/forms';
import {Router} from '@angular/router';
import { promise } from 'protractor';
import {IMyDrpOptions, MYDRP_VALUE_ACCESSOR} from 'mydaterangepicker';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

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
  private user_id;
  private _id;
  private times;
  private myform: FormGroup;
  private myform2: FormGroup;
  public myDateRangePickerOptions: IMyDrpOptions = {
    // other options...
    dateFormat: 'dd/mm/yyyy',
};
private modalRef: BsModalRef;



  constructor(private service: ApiService, private fb: FormBuilder, private router:Router,private modalService: BsModalService) { }

  //Open modal
  openModal(template: TemplateRef<any>, time) {
    console.log("values before to open modal", time);
    this._id = time._id;
    this.fillForm2(time);
    this.modalRef = this.modalService.show(template);
  }

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
    this.service.getSchedule(this.user_id)
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
    let sendData = {"user_id":"","reason":"","day_off":{"day":0, "month":0, "year":0, "hour":0, "minutes":0}, 
    "day_on":{"day":0, "month":0, "year":0, "hour":0, "minutes":0}};
    sendData.user_id = this.user_id;
    sendData.reason = data.time_off_reason;
    sendData.day_off.day = data.myDateRange.beginDate.day;
    sendData.day_off.month = data.myDateRange.beginDate.month;
    sendData.day_off.year = data.myDateRange.beginDate.year;
    sendData.day_off.hour = parseInt(data.start_time_hour);
    sendData.day_off.minutes = parseInt(data.start_time_minutes);
    sendData.day_on.day = data.myDateRange.endDate.day;
    sendData.day_on.month = data.myDateRange.endDate.month;
    sendData.day_on.year = data.myDateRange.endDate.year;
    sendData.day_on.hour = parseInt(data.end_time_hour);
    sendData.day_on.minutes = parseInt(data.end_time_minutes);
    this.service.addTimeOff(sendData)
    .subscribe(response => {
      if(response.status === 201){
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
      time_off_reason:"",
      start_time_hour:0,
      start_time_minutes: 0,
      end_time_hour:0,
      end_time_minutes: 0
      
    });
}

//****************** Time off Methods *******************************

//change time off month to string
convertMonthString(times):Object{
  let result = [];
  let index;
  let months = ["Jan","Feb","Mar","Abr","May","Jun","Jul","Aug","Set","Oct","Nov","Dic"]
  times.forEach(element => {
    index = element.day_off.month - 1;
    element.day_off.monthString = months[index]
    index = element.day_on.month - 1;
    element.day_on.monthString = months[index]
    result.push(element);
    
  });
  return result
}

//get the times for the user
getTime():void{

  this.service.getTimes(this.user_id).subscribe(response =>{
    if(response.status != 204)
    {
      alert("Issue loading time off");
    }
    else{
      this.times = this.convertMonthString(response.body);
      
    }
    
  })
}

// Update time off method
updateTimeOff(data):Observable<Object>{
  console.log("Values from the form", data);
  let sendData = {"_id":"","reason":"","reason_delete_modify": "", "day_off":{"day":0, "month":0, "year":0, "hour":0, "minutes":0}, 
    "day_on":{"day":0, "month":0, "year":0, "hour":0, "minutes":0}};
    sendData._id = this._id;
    sendData.reason = data.time_off_reason;
    sendData.reason_delete_modify = data.time_off_reasonMD;
    sendData.day_off.day = data.myDateRange.beginDate.day;
    sendData.day_off.month = data.myDateRange.beginDate.month;
    sendData.day_off.year = data.myDateRange.beginDate.year;
    sendData.day_off.hour = parseInt(data.start_time_hour);
    sendData.day_off.minutes = parseInt(data.start_time_minutes);
    sendData.day_on.day = data.myDateRange.endDate.day;
    sendData.day_on.month = data.myDateRange.endDate.month;
    sendData.day_on.year = data.myDateRange.endDate.year;
    sendData.day_on.hour = parseInt(data.end_time_hour);
    sendData.day_on.minutes = parseInt(data.end_time_minutes);
    this.service.updateTimeOff(sendData)
    .subscribe(response => {
      if(response.status === 204){
        alert("Time off Modified");
        this.modalRef.hide();
        this.ngOnInit();
      }
      else{
        alert("Time off not added, please contact your administrator")
      }
    })
    return
}


//Fill form for modal
fillForm2(time):void{
  
  this.myform2.patchValue({
    myDateRange: {
      beginDate: {
          year: time.day_off.year,
          month: time.day_off.month,
          day: time.day_off.day
      },
      endDate: {
          year: time.day_on.year,
          month: time.day_on.month,
          day: time.day_on.day
      }
      

  },
      time_off_reason:time.reason,
      time_off_reasonMD: "",
      start_time_hour:time.day_off.hour,
      start_time_minutes: time.day_off.minutes,
      end_time_hour:time.day_on.hour,
      end_time_minutes: time.day_on.minutes
      
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
      end_time_minutes: ['', Validators.required],
      time_off_reason:['', Validators.required]
     

  });
  this.myform2 = this.fb.group({

    myDateRange: ['', Validators.required],
    start_time_hour:['', Validators.required],
    start_time_minutes: ['', Validators.required],
    end_time_hour:['', Validators.required],
    end_time_minutes: ['', Validators.required],
    time_off_reason:['', Validators.required],
    time_off_reasonMD:['', Validators.required]

});
    this.service.currentId.subscribe(message => this.user_id = message);
    this.getTime();
    this.getSchedule();
    $('#queue_monitors_tab').removeClass('active');
  }

}
