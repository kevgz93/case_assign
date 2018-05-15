import { Component, OnInit } from '@angular/core';
import {ApiService} from '../api.service';
import { Observable } from 'rxjs/Observable';
import {Router} from '@angular/router';
import { promise } from 'protractor';

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
  public countDay = 0;
  public countWeek = 0;
  public countMonth = 0;
  private condition;
  private qm;
  private timezone = {};
  public today;
  public date = new Date();


  constructor(private service: ApiService, private router:Router) { }

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
      var count = [{}];
      var monday;
      var month = this.date.getMonth() + 1;
      var month2 = this.date.getMonth();
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
        if (morn_hour <= this.date.getHours() && aft_hour >= this.date.getHours()){
          return true;
        }
        else if (date.getDay() === 6 || date.getDay() === 0){
          return true;
        }
        return false;
      }

      colorHour(afternoon, difference):string{
        let aft_hour = afternoon.hour - difference;
        let aft_minutes = afternoon.minutes;
        let hour = aft_hour - this.date.getHours();
        let minutes = this.date.getMinutes() - aft_minutes;

        if (hour === 1 && minutes <= 30){
          return "warning";
        }

        else if (hour === 1 && minutes > 30){
          return "danger";
        }
        return "";
      }

      //see if have time off
      timeoff(schedule, id):boolean{
        let day_on = schedule.day_on;
        let day_off = schedule.day_off;
        let hour = this.date.getHours();
        let minutes = this.date.getMinutes();
        let day = this.date.getDate();
        let month = this.date.getMonth() + 1;
        let available:boolean;
        let time:boolean;
        let avai:boolean;
        
        // 'entry before to start the day_off witout time'
        if(day < day_off.day && month <= day_off.month){
          console.log('entry before to start the day_off witout time');
          return  true;
        }
        // 'entry before to start the day_off with hour'
        else if(day === day_off.day && month === day_off.month && hour < day_off.hour){
          console.log('entry before to start the day_off with hour');
          return  true;
        }

        // 'entry before to start the day_off with minutes''
        else if(day === day_off.day && month === day_off.month && hour === day_off.hour && minutes < day_off.minutes){
          console.log('entry before to start the day_off with minutes');
          return  true;
        }

        //'entry between the time off and without hour
        else if(day >= day_off.day && month >= day_off.month && day < day_on.day && month <= day_on.month){
          console.log('entry between the time off without hour' );
          return  false;
        }

        //'entry between the time off and with hour
        else if(day >= day_off.day && month >= day_off.month && day <= day_on.day && month <= day_on.month && hour < day_on.hour){
          console.log('entry between the time off less hour' );
          return  false;
        }

        //'entry between the time off and less minutes
        else if(day >= day_off.day && month >= day_off.month && day <= day_on.day && month <= day_on.month && hour === day_on.hour &&
        minutes < day_on.minutes){
          console.log('entry between the time off less minutes' );
          return  false;
        }
         else {
          console.log('entro a  else',);
            return true
           }
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

      filterSchedule(data, id){
        let today = {time:"", available:true, color:"white", timeoff: false};
        let hour = {morning:0, afternoon:0};
        let minutes= {morning:0, afternoon:0};
        let morning_minutes;
        let afternoon_minutes;
        let available:boolean;
        let timeoff:boolean;
        let color;
        let difference = this.date.getTimezoneOffset() / 60; // this difference is because the times are saved on the DB as gmt+0
        if (this.date.getDay()===1){
          available = this.endDay(data.monday_morning, data.monday_afternoon, difference);
          timeoff = this.timeoff(data, id);
          console.log("Timeoff", timeoff);
          color = this.colorHour(data.monday_afternoon, difference);
          //console.log("color", color);
          hour.morning = data.monday_morning.hour - difference;
          minutes.morning = data.monday_morning.minutes;
          hour.afternoon = data.monday_afternoon.hour - difference;
          minutes.afternoon = data.monday_afternoon.minutes;
          morning_minutes = this.checkMinutes(minutes.morning);
          afternoon_minutes = this.checkMinutes(minutes.afternoon);
          today.time= `${hour.morning}:${morning_minutes} - ${hour.afternoon}:${afternoon_minutes}`;
          today.available = true;//cambiarlo a available
          today.color = color;
          today.timeoff = timeoff;
          return today;
        }
        else if (this.date.getDay()===2){
          available = this.endDay(data.tuesday_morning, data.tuesday_afternoon, difference);
          color = this.colorHour(data.tuesday_afternoon, difference);
          timeoff = this.timeoff(data, id);
          console.log("available", timeoff);
          hour.morning = data.tuesday_morning.hour - difference;
          minutes.morning = data.tuesday_morning.minutes;
          hour.afternoon = data.tuesday_afternoon.hour - difference;
          minutes.afternoon = data.wednesday_afternoon.minutes;
          morning_minutes = this.checkMinutes(minutes.morning);
          afternoon_minutes = this.checkMinutes(minutes.afternoon);
          today.time= `${hour.morning}:${morning_minutes} - ${hour.afternoon}:${afternoon_minutes}`;
          today.available = available;
          today.color = color;
          today.timeoff = timeoff;
          return today;
        }
        else if (this.date.getDay()===3){
          available = this.endDay(data.wednesday_morning, data.wednesday_afternoon, difference);
          timeoff = this.timeoff(data, id);
          console.log("available", timeoff);
          color = this.colorHour(data.wednesday_afternoon, difference);
          hour.morning = data.wednesday_morning.hour - difference;
          minutes.morning = data.wednesday_morning.minutes;
          hour.afternoon = data.wednesday_afternoon.hour - difference;
          minutes.afternoon = data.wednesday_afternoon.minutes;
          morning_minutes = this.checkMinutes(minutes.morning);
          afternoon_minutes = this.checkMinutes(minutes.afternoon);
          today.time= `${hour.morning}:${morning_minutes} - ${hour.afternoon}:${afternoon_minutes}`;
          today.available = available;
          today.color = color;
          today.timeoff = timeoff;
          return today;
        }
        else if (this.date.getDay()===4){
          available = this.endDay(data.thursday_morning , data.thursday_afternoon, difference);
          timeoff = this.timeoff(data, id);
          console.log("available", timeoff);
          color = this.colorHour(data.thursday_afternoon, difference);
          //console.log("color", color);
          hour.morning = data.thursday_morning.hour - difference;
          minutes.morning = data.thursday_morning.minutes;
          hour.afternoon = data.thursday_afternoon.hour - difference;
          minutes.afternoon = data.thursday_afternoon.minutes;
          morning_minutes = this.checkMinutes(minutes.morning);
          afternoon_minutes = this.checkMinutes(minutes.afternoon);
          today.time= `${hour.morning}:${morning_minutes} - ${hour.afternoon}:${afternoon_minutes}`;
          today.available = available;
          today.color = color;
          today.timeoff = timeoff;
          return today;
        }
        else if (this.date.getDay()===5){
          available = this.endDay(data.friday_morning, data.friday_afternoon, difference);
          timeoff = this.timeoff(data, id);
          console.log("available", timeoff);
          color = this.colorHour(data.friday_afternoon, difference);
          hour.morning = data.friday_morning.hour - difference;
          minutes.morning = data.friday_morning.minutes;
          hour.afternoon = data.friday_afternoon.hour - difference;
          minutes.afternoon = data.friday_afternoon.minutes;
          morning_minutes = this.checkMinutes(minutes.morning);
          afternoon_minutes = this.checkMinutes(minutes.afternoon);
          today.time= `${hour.morning}:${morning_minutes} - ${hour.afternoon}:${afternoon_minutes}`;
          today.available = available;
          today.color = color;
          today.timeoff = timeoff;
          return today;
        }
        else if (this.date.getDay()===6 || this.date.getDay()===0){
          available = this.endDay(data.friday_morning, data.friday_afternoon, difference);
          timeoff = this.timeoff(data, id);
          console.log("available", timeoff);
          color = this.colorHour(data.friday_afternoon, difference);
          hour.morning = data.friday_morning.hour - difference;
          minutes.morning = data.friday_morning.minutes;
          hour.afternoon = data.friday_afternoon.hour - difference;
          minutes.afternoon = data.friday_afternoon.minutes;
          morning_minutes = this.checkMinutes(minutes.morning);
          afternoon_minutes = this.checkMinutes(minutes.afternoon);
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
        else if (time === "ct"){
          return "Central Time Zone"
        }
        else if (time === "et"){
          return "Easter Time Zone"
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

      }


    getAllEng(): Observable<engineer>{
      var aux = {};
      this.cleanCount();
      var count;
      this.service.getAllEngineers()
      .subscribe(data => {
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
          this.data[i].today = this.filterSchedule(this.data[i].schedule_loaded[0], data[i]._id);
          this.data[i].disableAddButton = this.disableAddButton(this.data[i].max_case, this.countDay);
          this.data[i].disableLessButton = this.disableLessButton();
          this.cleanCount();



        }
        this.showhtml = true;

        console.log(this.data);
      })


      return;
    }


    addTicket(id, engi_name, engi_last):void{
      let user;
      this.condition = id;
      this.service.getUserBySessionId().subscribe(response => {
        user = response.body;
        const body = JSON.stringify({"engi_id": id,"engi_name":engi_name,"engi_last_name":engi_last,
         "user_id": user._id,"user_name":user.name,"user_last_name":user.last_name});
        console.log(body);
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


    deleteTicket(id): Observable<any>{
      this.condition = id;
      this.service.deleteTickets(id)
      .subscribe(msj => {
        if(msj.status != 200)
        {
          console.log(msj);
        }
        else{
          console.log(msj)
        }
        this.getAllEng();
      })

      return;
    }
    //add the corresponding QM
    currentQM(week):void{
      console.log("current week",week);
      let date = new Date;
      let day = date.getDay();
      let time = date.getHours();

      if(day ===1 && time <12){
        this.qm = week.monday_morning;
      }
      else if(day ===1 && time >12){
        this.qm = week.monday_afternoon;
      }
      else if(day ===2 && time < 12){
        this.qm = week.tuesday_morning;
      }
      else if(day ===2 && time >12){
        this.qm = week.tuesday_afternoon;
      }
      else if(day ===3 && time <12){
        this.qm = week.wednesday_morning;
      }
      else if(day ===3 && time >12){
        this.qm = week.wednesday_afternoon;
      }
      else if(day ===4 && time <12){
        this.qm = week.thursday_morning;
      }
      else if(day ===4 && time >12){
        this.qm = week.thursday_afternoon;
      }
      else if(day ===5 && time <12){
        this.qm = week.friday_morning;
      }
      else if(day ===5 && time >12){
        this.qm = week.friday_afternoon;
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
        console.log("could found the current");
      }
        })

    }

    disableAddButton(max, countday): boolean{
      if (countday >= max && max !== 0){
        return true;
      }
      return false;
    }

    disableLessButton(): boolean{
      if (this.condition){
        return true;
      }

      return false;
    }


  ngOnInit() {
    //this.showhtml = false;
    //console.log("se cambio a false");
    this.getQM();
    this.getAllEng();
  }
}
