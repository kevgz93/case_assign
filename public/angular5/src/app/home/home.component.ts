import { Component, OnInit, TemplateRef } from '@angular/core';
import {ApiService} from '../api.service';
import { Observable } from 'rxjs/Rx';
import {take} from 'rxjs/operators';
import {Router} from '@angular/router';
import { promise } from 'protractor';
import {FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import {ConvertTimeZero} from './../lib/Time_zero'
import {working_days} from './../lib/working_days';
import { case_average } from './../lib/case_average';
import { resolve } from 'dns';
import { reject } from 'q';


declare var jquery:any;
declare var $ :any;

interface engineer{
  _id : string;
	eng_name : String,
  last_name : String,
  email: String,
  city : String,
  work_start: Number,
  work_end: Number,
  time_zone: Number,
  sta_dyn: Number,
  max_case: Number,
  status: Boolean
};

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})


export class HomeComponent implements OnInit {
  private data = null;
  private status = null;
  public showhtml:Boolean=false;
  public loading:Boolean=true;
  public countDay = 0;
  public countWeek = 0;
  public countMonth = 0;
  private condition = {id:'', action:'disable'};
  private qm;
  private timezone = {};
  public today;
  public date = new Date();
  private convertTimeZone = new ConvertTimeZero();
  private workingDays = new working_days();
  private average = new case_average(this.service);
  public interval;
  myform: FormGroup;
  modalRef: BsModalRef;


  constructor(private service: ApiService, private fb: FormBuilder, private router:Router, private modalService: BsModalService) { 
    
    // Observable.timer(30000, 30000).pipe(
    //   take(3)).subscribe(x=>{
    //     this.refreshHome();
    //    })

    let timer = Observable.timer(30000, 30000);
    this.interval = timer.subscribe(t=> {
      this.refreshHome();
    });
  }

    // Simulate GET /todos

    addCountDay(thiscase, month): void{
      if (this.date.getDate() == thiscase.date.date && month == thiscase.date.month){
        this.countDay++;
      }

    }

    addCountWeek(thiscase, monday): void{
      var current_month = monday.getMonth() + 1;
      var next_month = monday.getMonth() + 2;
      if (thiscase.date.date >= monday.getDate()  && thiscase.date.month == current_month){
        this.countWeek++;
      }
      else if(thiscase.date.month == next_month && thiscase.date.date < 5){
        this.countWeek++;
      }

    }



    addCountMonth(thiscase, month): void{
      if (month == thiscase.date.month ){
        this.countMonth++;
      }

    }

  cleanCount():void{
    this.countDay = 0;
    this.countWeek = 0;
    this.countMonth = 0;
  }

    filterDay(thiscase): void{
      let date = new Date();
      var count = [{}];
      var monday;
      var month = date.getMonth() + 1;
      var month2 = date.getMonth();
      if(month == 0)
      {
        month2 == 12
      }

      function getMonday(d) {
        d = new Date(d);
        var day = d.getDay(),
            diff = d.getDate() - day + (day == 0 ? -6:1); // adjust when day is sunday
        return new Date(d.setDate(diff));
      }

      monday = getMonday(new Date());


      this.addCountDay(thiscase, month);
      this.addCountWeek(thiscase, monday)
      this.addCountMonth(thiscase, month);



      }
      //Check the shift and unable if is out
      endDay(morning, afternoon, difference):boolean{     
        let aft_hour = afternoon.hour - difference;
        let morn_hour = morning.hour - difference;
        let date = new Date;
        if (morn_hour > date.getHours()){
          return false;
        }
        else if (morn_hour >= date.getHours() && date.getMinutes() < morning.minutes){
          return false;
        }
        else if (morn_hour <= date.getHours() && aft_hour > date.getHours()){
          return true;
        }
        else if (morn_hour <= date.getHours() && aft_hour === date.getHours() && afternoon.minutes > date.getMinutes()){
          return true;
        }
        else if (date.getDay() === 6 || date.getDay() === 0){
          return true;
        }
        return false;
      }

      colorHour(afternoon, difference):string{
        let date = new Date();
        let aft_hour = afternoon.hour - difference;
        let aft_minutes = afternoon.minutes;
        let hour = aft_hour - date.getHours();// 1
        
        let minutes = date.getMinutes() - aft_minutes; //30
        if(minutes < 0){
          minutes = -(minutes);
        }
        
        if (hour === 1 && minutes < 30){
          return "warning";
        }

        else if (hour === 0 && minutes > 30){
          return "warning";
        }

        else if (hour === 1 && minutes >= 30){
          return "danger";
        }

        else if (hour === 0 && date.getMinutes() <= aft_minutes){
          return "danger";
        }
        return "";
      }

      //check and send if need to changes working days on database
      working_days(timeoff, working_days, timeoff_status, id):Promise<object>{
        let result:any
        let date = new Date();
        let current_month = date.getMonth()+1;
        var promise = new Promise((resolve,reject) => {
          // if time off is null
          if(Object.keys(timeoff).length === 0){
            let current_month = this.date.getMonth() + 1;
            timeoff = {"day_off":{"month":current_month},"day_on":{"day":0}};
          }

          //if there are timeoff with different month
        if(date.getDate() <= 3 && working_days.next_month_status){
          //services to changes working days
          this.service.case_average_next_month(id).subscribe(data =>{
            if (data.status != 204){
              alert("error with case average, please contact the administrator");
            }
            result =  data.body;
            resolve(result);
          })
        }

      //month change and the users are still off
      else if(timeoff.day_off.month != current_month && timeoff.day_on.day <= date.getDate() && working_days.next_month_status){
        //let response = this.workingDays.working_days(timeoff);
        //services to changes working days
        this.service.case_average_next_month(id).subscribe(data =>{
          if (data.status != 204){
            alert("error with case average, please contact the administrator");
          }
          result =  data.body;
          resolve(result);
        })
      }

        //when a time off start on the same month
        else if(!timeoff_status && !working_days.status){
          
          let response = this.workingDays.working_days(timeoff);
          //services to changes working days
          this.service.case_average_add({"_id":id,"working_days":response}).subscribe(data =>{
            if (data.status != 204){
              alert("error with case average, please contact the administrator");
            }
            result =  data.body;
            resolve(result);
          })
        }
        
        //when the time off end
        else if(timeoff_status && working_days.status){

          this.service.case_average_endTimeoff({"_id":id}).subscribe(data =>{
            if (data.status != 204){
              alert("error with case average, please contact the administrator");
            }
            result =  data.body;
            resolve(result);
          })
        }
        
        else{
          result =  working_days;
          resolve(result);
        }

        })
        

        return promise;
      }
      
      //see if have time off
      timeoff(timeoff):object{
        let date = new Date();
        let result={"status": true, "timeoff":{}};
        let day_on;
        let day_off;
        let length = Object.keys(timeoff).length;
        let hour = date.getHours();
        let minutes = date.getMinutes();
        let day = date.getDate();
        let month = date.getMonth() + 1;
        let year = date.getFullYear();
        if(length === 0){
          result.status = true;
        }
        timeoff.forEach(element => {
        day_off = element.day_off;
        day_on = element.day_on;
        // 'entry before to start the day_off witout time'
        if(day < day_off.day && month <= day_off.month){
          result.status = true;
          result.timeoff = element;
          }
          // 'entry before to start the day_off with hour'
        else if(day === day_off.day && month === day_off.month && hour < day_off.hour){
        result.status = true;
        result.timeoff = element;
        }
        
        // 'entry before to start the day_off with minutes''
        else if(day === day_off.day && month === day_off.month && hour === day_off.hour && minutes < day_off.minutes ){
        result.status = true;
        result.timeoff = element;
        }

        // 'entry after to start the day_off with minutes''
        else if(day === day_off.day && month === day_off.month && hour === day_off.hour && minutes >= day_off.minutes ){
          result.status = false;
          result.timeoff = element;
        }

        //'entry between the time off with different months and it's on first month
        else if(day >= day_off.day && month === day_off.month && day > day_on.day && month != day_on.month){
          result.status = false;
          result.timeoff = element;
        }

        //'entry between the time off with different months and it's on second month 
        else if(day <= day_off.day && month != day_off.month && day < day_on.day && month === day_on.month){
          result.status = false;
          result.timeoff = element;
        }
        
        //'entry between the time off and without hour
        else if(day >= day_off.day && month >= day_off.month && day < day_on.day && month <= day_on.month){
        result.status = false;
        result.timeoff = element;
        }
        
        //'entry between the time off and with hour
        else if(day >= day_off.day && month >= day_off.month && day <= day_on.day && month <= day_on.month && hour < day_on.hour){
        result.status = false;
        result.timeoff = element;
        }
        
        //'entry between the time off and less minutes
        else if(day >= day_off.day && month >= day_off.month && day <= day_on.day && month <= day_on.month && hour === day_on.hour &&
        minutes < day_on.minutes){
        result.status = false;
        result.timeoff = element;
        }
        else {
          result.status = true
          }
  
      });
      return result; 

    }

      checkMinutes(minutes):string{
        if (minutes != 0){
          return `${minutes}`;
        }
        return `${minutes}0`;
      }

      //convert to string static and dynamic
      convertStaDyn(value):String{
        let string;
        if(value === 1){
           string = "Static";
        }
        else if(value === 2){
           string = "Dynamic";
        }
        else {
           string = "Both";
        }
        return string;
      }

      filterSchedule(data,time_off){
        time_off = this.convertTimeZone.convertFromTimeOffLocally(time_off);
        
        let today = {morning:0, time:"", available:true, color:"white", timeoff: false,average:{}};
        let hour = {morning:0, afternoon:0};
        let minutes= {morning:0, afternoon:0};
        let morning_minutes;
        let afternoon_minutes;
        let available:boolean;
        let timeoff:any;
        let color;
        let difference = this.date.getTimezoneOffset() / 60; // this difference is because the times are saved on the DB as gmt+0
        if (this.date.getDay()===1){
          timeoff = this.timeoff(time_off);
          available = this.endDay(data.monday_morning, data.monday_afternoon, difference);
          color = this.colorHour(data.monday_afternoon, difference);
          hour.morning = data.monday_morning.hour - difference;
          minutes.morning = data.monday_morning.minutes;
          hour.afternoon = data.monday_afternoon.hour - difference;
          minutes.afternoon = data.monday_afternoon.minutes;
          //hour.morning = this.TwentyFourFormat.checkHour(hour.morning);
          morning_minutes = this.checkMinutes(minutes.morning);
          afternoon_minutes = this.checkMinutes(minutes.afternoon);
          today.morning = hour.morning = data.monday_morning.hour - difference;
          today.time= `${hour.morning}:${morning_minutes} - ${hour.afternoon}:${afternoon_minutes}`;
          today.available = available;//cambiarlo a available
          today.color = color;
          today.timeoff = timeoff;
          return today;
        }
        else if (this.date.getDay()===2){
          timeoff = this.timeoff(time_off);
          available = this.endDay(data.tuesday_morning, data.tuesday_afternoon, difference);
          color = this.colorHour(data.tuesday_afternoon, difference);
          hour.morning = data.tuesday_morning.hour - difference;
          minutes.morning = data.tuesday_morning.minutes;
          hour.afternoon = data.tuesday_afternoon.hour - difference;
          minutes.afternoon = data.tuesday_afternoon.minutes;
          //hour.morning = this.TwentyFourFormat.checkHour(hour.morning);
          morning_minutes = this.checkMinutes(minutes.morning);
          afternoon_minutes = this.checkMinutes(minutes.afternoon);
          today.morning = hour.morning = data.tuesday_morning.hour - difference;
          today.time= `${hour.morning}:${morning_minutes} - ${hour.afternoon}:${afternoon_minutes}`;
          today.available = available;
          today.color = color;
          today.timeoff = timeoff;

          return today;
        }
        else if (this.date.getDay()===3){
          timeoff = this.timeoff(time_off);
          available = this.endDay(data.wednesday_morning, data.wednesday_afternoon, difference);
          color = this.colorHour(data.wednesday_afternoon, difference);
          hour.morning = data.wednesday_morning.hour - difference;
          minutes.morning = data.wednesday_morning.minutes;
          hour.afternoon = data.wednesday_afternoon.hour - difference;
          minutes.afternoon = data.wednesday_afternoon.minutes;
          morning_minutes = this.checkMinutes(minutes.morning);
          //hour.morning = this.TwentyFourFormat.checkHour(hour.morning);
          afternoon_minutes = this.checkMinutes(minutes.afternoon);
          today.morning = hour.morning = data.wednesday_morning.hour - difference;
          today.time= `${hour.morning}:${morning_minutes} - ${hour.afternoon}:${afternoon_minutes}`;
          today.available = available;
          today.color = color;
          today.timeoff = timeoff;

          return today;
        }
        else if (this.date.getDay()===4){
          timeoff = this.timeoff(time_off);
          available = this.endDay(data.thursday_morning, data.thursday_afternoon, difference);
          color = this.colorHour(data.thursday_afternoon, difference);
          hour.morning = data.thursday_morning.hour - difference;
          minutes.morning = data.thursday_morning.minutes;
          hour.afternoon = data.thursday_afternoon.hour - difference;
          minutes.afternoon = data.thursday_afternoon.minutes;
          //hour.morning = this.TwentyFourFormat.checkHour(hour.morning);
          morning_minutes = this.checkMinutes(minutes.morning);
          afternoon_minutes = this.checkMinutes(minutes.afternoon);
          today.morning = hour.morning = data.thursday_morning.hour - difference;
          today.time= `${hour.morning}:${morning_minutes} - ${hour.afternoon}:${afternoon_minutes}`;
          today.available = available;
          today.color = color;
          today.timeoff = timeoff;

          return today;
        }
        else if (this.date.getDay()===5){
          timeoff = this.timeoff(time_off);
          available = this.endDay(data.friday_morning, data.friday_afternoon, difference);
          color = this.colorHour(data.friday_afternoon, difference);
          hour.morning = data.friday_morning.hour - difference;
          minutes.morning = data.friday_morning.minutes;
          hour.afternoon = data.friday_afternoon.hour - difference;
          minutes.afternoon = data.friday_afternoon.minutes;
          //hour.morning = this.TwentyFourFormat.checkHour(hour.morning);
          morning_minutes = this.checkMinutes(minutes.morning);
          afternoon_minutes = this.checkMinutes(minutes.afternoon);
          today.morning = hour.morning = data.friday_morning.hour - difference;
          today.time= `${hour.morning}:${morning_minutes} - ${hour.afternoon}:${afternoon_minutes}`;
          today.available = available;
          today.color = color;
          today.timeoff = timeoff;

          return today;
        }
        else if (this.date.getDay()===6|| this.date.getDay()===0){
          timeoff = this.timeoff(time_off);
          available = this.endDay(data.friday_morning, data.friday_afternoon, difference);
          color = this.colorHour(data.friday_afternoon, difference);
          hour.morning = data.friday_morning.hour - difference;
          minutes.morning = data.friday_morning.minutes;
          hour.afternoon = data.friday_afternoon.hour - difference;
          minutes.afternoon = data.friday_afternoon.minutes;
          //hour.morning = this.TwentyFourFormat.checkHour(hour.morning);
          morning_minutes = this.checkMinutes(minutes.morning);
          afternoon_minutes = this.checkMinutes(minutes.afternoon);
          today.morning = hour.morning = data.friday_morning.hour - difference;
          today.time= `${hour.morning}:${morning_minutes} - ${hour.afternoon}:${afternoon_minutes}`;          
          today.available = available;
          today.color = color;
          today.timeoff = timeoff;

          return today;
        }
        // modificar aca y crear un nuevo metodo para el agregar los colores
      }

      FromRefreshFilterSchedule(data,time_off){
      //filterSchedule(data,time_off){
        //time_off = this.convertTimeZone.convertFromTimeOffLocally(time_off);
        let dateNow = new Date();
        let today = {morning:0, time:"", available:true, color:"white", timeoff: false,average:{}};
        let hour = {morning:0, afternoon:0};
        let minutes= {morning:0, afternoon:0};
        let morning_minutes;
        let afternoon_minutes;
        let available:boolean;
        let timeoff:any;
        let color;
        let difference = dateNow.getTimezoneOffset() / 60;  // this difference is because the times are saved on the DB as gmt+0
        if (dateNow.getDay()===1){
          timeoff = this.timeoff(time_off);
          available = this.endDay(data.monday_morning, data.monday_afternoon, difference);
          color = this.colorHour(data.monday_afternoon, difference);
          hour.morning = data.monday_morning.hour - difference;
          minutes.morning = data.monday_morning.minutes;
          hour.afternoon = data.monday_afternoon.hour - difference;
          minutes.afternoon = data.monday_afternoon.minutes;
          //hour.morning = this.TwentyFourFormat.checkHour(hour.morning);
          morning_minutes = this.checkMinutes(minutes.morning);
          afternoon_minutes = this.checkMinutes(minutes.afternoon);
          today.morning = hour.morning = data.monday_morning.hour - difference;
          today.time= `${hour.morning}:${morning_minutes} - ${hour.afternoon}:${afternoon_minutes}`;
          today.available = available;//cambiarlo a available
          today.color = color;
          today.timeoff = timeoff;
          return today;
        }
        else if (dateNow.getDay()===2){
          timeoff = this.timeoff(time_off);
          available = this.endDay(data.tuesday_morning, data.tuesday_afternoon, difference);
          color = this.colorHour(data.tuesday_afternoon, difference);
          hour.morning = data.tuesday_morning.hour - difference;
          minutes.morning = data.tuesday_morning.minutes;
          hour.afternoon = data.tuesday_afternoon.hour - difference;
          minutes.afternoon = data.tuesday_afternoon.minutes;
          //hour.morning = this.TwentyFourFormat.checkHour(hour.morning);
          morning_minutes = this.checkMinutes(minutes.morning);
          afternoon_minutes = this.checkMinutes(minutes.afternoon);
          today.morning = hour.morning = data.tuesday_morning.hour - difference;
          today.time= `${hour.morning}:${morning_minutes} - ${hour.afternoon}:${afternoon_minutes}`;
          today.available = available;
          today.color = color;
          today.timeoff = timeoff;

          return today;
        }
        else if (dateNow.getDay()===3){
          timeoff = this.timeoff(time_off);
          available = this.endDay(data.wednesday_morning, data.wednesday_afternoon, difference);
          color = this.colorHour(data.wednesday_afternoon, difference);
          hour.morning = data.wednesday_morning.hour - difference;
          minutes.morning = data.wednesday_morning.minutes;
          hour.afternoon = data.wednesday_afternoon.hour - difference;
          minutes.afternoon = data.wednesday_afternoon.minutes;
          morning_minutes = this.checkMinutes(minutes.morning);
          //hour.morning = this.TwentyFourFormat.checkHour(hour.morning);
          afternoon_minutes = this.checkMinutes(minutes.afternoon);
          today.morning = hour.morning = data.wednesday_morning.hour - difference;
          today.time= `${hour.morning}:${morning_minutes} - ${hour.afternoon}:${afternoon_minutes}`;
          today.available = available;
          today.color = color;
          today.timeoff = timeoff;

          return today;
        }
        else if (dateNow.getDay()===4){
          timeoff = this.timeoff(time_off);
          available = this.endDay(data.thursday_morning, data.thursday_afternoon, difference);
          color = this.colorHour(data.thursday_afternoon, difference);
          hour.morning = data.thursday_morning.hour - difference;
          minutes.morning = data.thursday_morning.minutes;
          hour.afternoon = data.thursday_afternoon.hour - difference;
          minutes.afternoon = data.thursday_afternoon.minutes;
          //hour.morning = this.TwentyFourFormat.checkHour(hour.morning);
          morning_minutes = this.checkMinutes(minutes.morning);
          afternoon_minutes = this.checkMinutes(minutes.afternoon);
          today.morning = hour.morning = data.thursday_morning.hour - difference;
          today.time= `${hour.morning}:${morning_minutes} - ${hour.afternoon}:${afternoon_minutes}`;
          today.available = available;
          today.color = color;
          today.timeoff = timeoff;

          return today;
        }
        else if (dateNow.getDay()===5){
          timeoff = this.timeoff(time_off);
          available = this.endDay(data.friday_morning, data.friday_afternoon, difference);
          color = this.colorHour(data.friday_afternoon, difference);
          hour.morning = data.friday_morning.hour - difference;
          minutes.morning = data.friday_morning.minutes;
          hour.afternoon = data.friday_afternoon.hour - difference;
          minutes.afternoon = data.friday_afternoon.minutes;
          //hour.morning = this.TwentyFourFormat.checkHour(hour.morning);
          morning_minutes = this.checkMinutes(minutes.morning);
          afternoon_minutes = this.checkMinutes(minutes.afternoon);
          today.morning = hour.morning = data.friday_morning.hour - difference;
          today.time= `${hour.morning}:${morning_minutes} - ${hour.afternoon}:${afternoon_minutes}`;
          today.available = available;
          today.color = color;
          today.timeoff = timeoff;

          return today;
        }
        else if (dateNow.getDay()===6|| dateNow.getDay()===0){
          timeoff = this.timeoff(time_off);
          available = this.endDay(data.friday_morning, data.friday_afternoon, difference);
          color = this.colorHour(data.friday_afternoon, difference);
          hour.morning = data.friday_morning.hour - difference;
          minutes.morning = data.friday_morning.minutes;
          hour.afternoon = data.friday_afternoon.hour - difference;
          minutes.afternoon = data.friday_afternoon.minutes;
          //hour.morning = this.TwentyFourFormat.checkHour(hour.morning);
          morning_minutes = this.checkMinutes(minutes.morning);
          afternoon_minutes = this.checkMinutes(minutes.afternoon);
          today.morning = hour.morning = data.friday_morning.hour - difference;
          today.time= `${hour.morning}:${morning_minutes} - ${hour.afternoon}:${afternoon_minutes}`;          
          today.available = available;
          today.color = color;
          today.timeoff = timeoff;

          return today;
        }
        // modificar aca y crear un nuevo metodo para el agregar los colores
      }

      addTimeZone(time):String{
        if (time === "cat"){
          return "Central America Time Zone"
        }
        else if (time === "pt"){
          return "Pacific Time Zone"
        }
        else if (time === "mt"){
          return "Mountain Time Zone"
        }
        else if (time === "ct"){
          return "Central Time Zone"
        }
        else if (time === "et"){
          return "Eastern Time Zone"
        }
        else if (time === "uk"){
          return "UK Time Zone"
        }
        else if(time === "cet"){
          return "Central European Time Zone"
        }
        else if(time === "ist"){
          return "Indian Standard Time Zone"
        }
        else if(time === "ict"){
          return "Indochina Time Zone"
        }
        else if(time === "sgt"){
          return "Singapore Time Zone";
        }
        else if(time === "jst"){
          return "Japan Time Zone"
        }
        else{
          return "et";
        }

      }


    getAllEng(): Observable<engineer>{
      var aux = {};
      this.cleanCount();
      var count;
      this.service.getAllEngineers()
      .subscribe(async data => {
        if(data.status == 401)
        {
          this.router.navigate(['./'])
        }
        
        aux = data;
        this.data = data;
        // this.data.forEach(element => {
        //   element.countday = this.c
        // });
        for(let i in aux){
        
          for(let j in aux[i].cases_loaded){
            this.filterDay(aux[i].cases_loaded[j]);
          }
          this.data[i].time_zone = this.addTimeZone(this.data[i].schedule_loaded[0].time_zone);
          this.data[i].sta_dyn = this.convertStaDyn(this.data[i].sta_dyn);
          this.data[i].countday = this.countDay;
          this.data[i].countweek = this.countWeek;
          this.data[i].countmonth = this.countMonth;
          this.data[i].today = this.filterSchedule(this.data[i].schedule_loaded[0], this.data[i].time_off);
          this.data[i].disableAddButton = this.disableAddButton(this.data[i].max_case, this.countDay);
          this.data[i].disableLessButton = this.disableLessButton(this.data[i].last_case, this.data[i].cases_loaded);
          let working_days = await this.working_days(this.data[i].today.timeoff.timeoff,this.data[i].working_days,this.data[i].today.timeoff.status, this.data[i]._id);
          this.data[i].working_days = working_days;
          this.cleanCount();

          
        }
        //this.data = this.sortable(this.data);
        this.data.sort(function(a, b)
        {
          return a.today.morning-b.today.morning;
        });

        this.average.average(this.data).then(result => {
          this.data = result;
          this.loading=false;
          this.showhtml = true;
        });

      })

      

      return;
    }


    addTicket(id, engi_name, engi_last):void{
      let user;
      this.condition.id = id;
      this.condition.action = "enable";
      this.service.getUserBySessionId().subscribe(response => {
        user = response.body;
        const body = JSON.stringify({"engi_id": id,"engi_name":engi_name,"engi_last_name":engi_last,
         "user_id": user._id,"user_name":user.name,"user_last_name":user.last_name});
        this.service.addTickets(body).subscribe(response =>{
          let ticket;
          ticket = response;
          if (ticket.action === "added"){
            this.getAllEng();
          }
          else
            alert("cases not added");
        });
      });
    }


    deleteTicket(data): Observable<any>{
      this.condition.id = data.id;
      this.condition.action = "disable";
      this.service.deleteTickets(data)
      .subscribe(msj => {
        this.modalRef.hide();
        this.getAllEng();
      })

      return;
    }
    //get qm from emea

    currentQmEmea(week):string{
      let date = new Date;
      let day = date.getDay();
      if(day ===1 ){
        return week.monday.emea;
      }
      else if(day ===1 ){
        return week.monday.emea;
      }
      else if(day ===2 ){
        return week.tuesday.emea;
      }
      else if(day ===3 ){
        return week.wednesday.emea;
      }
      else if(day ===4 ){
        return week.thursday.emea;
      }
      else if(day ===5){
        return week.friday.emea;
      }

    }
    //get qm from america
    currentQmAms(week):string{
      let date = new Date;
      let day = date.getDay();
      let time = date.getHours();
      if(day ===1 && time <12){
        return week.monday.morning;
      }
      else if(day ===1){
        return week.monday.afternoon;
      }
      else if(day ===2 && time < 12){
        return week.tuesday.morning;
      }
      else if(day ===2){
        return week.tuesday.afternoon;
      }
      else if(day ===3 && time <12){
        return week.wednesday.morning;
      }
      else if(day ===3){
        return week.wednesday.afternoon;
      }
      else if(day ===4 && time <12){
        return week.thursday.morning;
      }
      else if(day ===4){
        return week.thursday.afternoon;
      }
      else if(day ===5 && time <12){
        return week.friday.morning;
      }
      else if(day ===5){
        return week.friday.afternoon;
      }

    }

    //add the corresponding QM
    currentQM(week):void{
      let date = new Date;
      let timezone = date.getTimezoneOffset() / 60; 
      if(timezone < 4){
        this.qm = this.currentQmEmea(week);
      }
      else{
        this.qm = this.currentQmAms(week);
      }

    }

    //Get the current QM
    getQM():void{
    let week;
    this.service.getWeekByStatus().subscribe(data =>{
      week = data.body;
      if(data.status === 200){
        this.currentQM(week)
      }
      else {
        this.qm = "Error";
      }
        })

    }

    disableAddButton(max, countday): boolean{
      if (countday >= max && max !== 0){
        return true;
      }
      return false;
    }

    disableLessButton(last_case, cases): boolean{
      let value = true;
      cases.forEach(element => {
        if (element._id === last_case ){
          value = false;
        }

      });
      

      return value;
    }

    //refres home
    refreshHome(){
        for(let i in this.data) {
          this.data[i].today = this.FromRefreshFilterSchedule(this.data[i].schedule_loaded[0], this.data[i].time_off);
        };
        //this.data = this.sortable(this.data);

    }


    //Open Modal and fill from

    //Open Modal
    openModal(template: TemplateRef<any>, id) {
      this.fillForm(id);
      this.modalRef = this.modalService.show(template);
    }

    //Fill the form group
    fillForm(id){
      this.myform= this.fb.group({
        id: id,
        delete_reason: ''
      });
    }

    async delay(ms: number) {
      await new Promise( resolve => setTimeout(resolve, ms) );
  }

  ngOnInit() {
    //this.showhtml = false;
    
    this.getQM();
    this.getAllEng();

    $('#queue_monitors_tab').removeClass('active');
  }

  ngOnDestroy() {
    this.interval.unsubscribe();
  }

  ngAfterViewChecked(){
    $('[data-toggle="tooltip"]').tooltip();
  }
}
