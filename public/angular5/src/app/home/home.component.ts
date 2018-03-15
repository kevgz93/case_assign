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

      filterSchedule(i):void{
        var today = this.date.getDay();
        if (today === 1){
          this.data[i].today = this.data[i].schedule_loaded[0].monday_morning + ":00-" + this.data[i].schedule_loaded[0].monday_afternoon + ":00";
        }
        else if (today === 2){
          this.data[i].today = this.data[i].schedule_loaded[0].tuesday_morning + ":00-" + this.data[i].schedule_loaded[0].tuesday_afternoon + ":00";
        }
        else if (today === 3){
          this.data[i].today = this.data[i].schedule_loaded[0].wednesday_morning + ":00-" + this.data[i].schedule_loaded[0].wednesday_afternoon + ":00";
        }
        else if (today === 4){
          this.data[i].today = this.data[i].schedule_loaded[0].thursday_morning + ":00-" + this.data[i].schedule_loaded[0].thursday_afternoon + ":00";
        }
        else if (today === 5){
          this.data[i].today = this.data[i].schedule_loaded[0].friday_morning + ":00-" + this.data[i].schedule_loaded[0].friday_afternoon + ":00";
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
        for(let i in aux){
          for(let j in aux[i].cases_loaded){
            this.filterDay(aux[i].cases_loaded[j]);
          }
          this.data[i].countday = this.countDay;
          this.data[i].countweek = this.countWeek;
          this.data[i].countmonth = this.countMonth;
          this.filterSchedule(i);
          
          
        }
        this.showhtml = true;
        
        console.log(this.data);
      })

      
      return;
    }


    addTicket(id):Observable<Response>{
      console.log(id);
      this.service.addTickets(id).subscribe(response =>{
        let user;
        user = response;
        if (user.action === "added"){
          this.getAllEng();
        }
        else
          alert("cases not added");
      });
     
      return;
    }


    deleteTicket(id): Observable<any>{
      console.log(id);
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

  ngOnInit() {
    this.getAllEng()
  }
}
