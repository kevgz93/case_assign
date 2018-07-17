import { Component, OnInit } from '@angular/core';
import {ApiService} from '../api.service';
import { Observable } from 'rxjs/Observable';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
declare var jquery:any;
declare var $ :any;

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {

  private myform: FormGroup;
  private myform2: FormGroup;
  private users;
  private months;
  private cases;
  private showReportCase:boolean = false;
  private showReportTimeoff:boolean = false;
  private showtableCase:Boolean = false;
  private showtotalCase:Boolean = false;
  private showtableTime:Boolean = false;
  private showtotalTime:Boolean = false;
  private timeoff;
  private user_timeoff;

  constructor(private service: ApiService, private router:Router, private fb: FormBuilder) { }

  showCaseHtml():void{
    console.log("Cases")
    this.showReportCase = true;
    this.showReportTimeoff = false;
    console.log("status", this.showReportCase);
  }

  showTimeoffHtml():void{
    console.log("Time")
    this.showReportCase = false;
    this.showReportTimeoff = true;
    console.log("status", this.showReportTimeoff);
  }

  getUsers(){
    this.service.getAllUsers()
    .subscribe(data => {
      this.users = data;
      
    })
    return;
  }


  //*************** moethods for cases */

  
  getTickets(form){
    
    this.service.getReportCase(form)
      .subscribe(data => {
        
        this.cases = data;
        this.cases.total = Object.keys(data).length;
        this.showtotalCase = true;
        this.showtableCase = true;
      }) 
  }


  //*************** moethods for timeoff */

  // get user name and last name to show on the screen
  getUserName(id):Object{
let user_time = {name:"", last_name:""};

    this.users.forEach(user => {
      if(user._id === id){
        user_time.name = user.name;
        user_time.last_name = user.last_name;
      }
    });
    return user_time;
  }


//change time off month to string
convertMonthString(times):Object{
  let result = [];
  let index;
  let months = ["Jan","Feb","Mar","Abr","May","Jun","Jul","Aug","Set","Oct","Nov","Dic"]
  times.forEach(element => {
    index = element.day_off.month - 1;
    element.day_off.monthString = months[index]
    if(element.day_off.minutes === 0){
      element.day_off.minutes = `${element.day_off.minutes}0`
    }
    index = element.day_on.month - 1;
    element.day_on.monthString = months[index]
    if(element.day_on.minutes === 0){
      element.day_on.minutes = `${element.day_on.minutes}0`
    }
    result.push(element);
    
  });
  return result
}
  
  getTimeoff(form){
    console.log(form);
    this.user_timeoff = this.getUserName(form.user);
    this.service.getReportTimeoff(form)
      .subscribe(data => {
        console.log(data);
        this.timeoff = this.convertMonthString(data);
        this.timeoff.total = Object.keys(data).length;
        this.showtotalTime = true;
        this.showtableTime = true;
      }) 
  }

  ngOnInit() {
    this.months = [{"id": 1, "name":"January"},{"id": 2, "name":"February"},{"id": 3, "name":"March"},{"id": 4, "name":"Abril"},
    {"id": 5, "name":"May"},{"id": 6, "name":"June"},{"id": 7, "name":"July"},{"id": 8, "name":"August"},{"id": 9, "name":"September"},
    {"id": 10, "name":"October"},{"id": 11, "name":"November"},{"id": 12, "name":"December"}];
    this.getUsers();
    this.myform= this.fb.group({
      user: 'all',
      month: 'all',
      case_status: 'added',

    });
    this.myform2 = this.fb.group({
      user: 'all',
      month: 'all',
      time_off_status: 'all',

    });
    $('#queue_monitors_tab').removeClass('active');
  }

}
