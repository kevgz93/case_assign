import { Component, OnInit } from '@angular/core';
import {ApiService} from '../api.service';
import { Observable } from 'rxjs/Observable';

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

  public aux = null;
  public data = null;
  public user = null;
  public status = null;
  public countDay = 0;
  public countWeek = 0;
  public date = new Date();
  

  constructor(private service: ApiService) { }

    // Simulate GET /todos

    addCountDay(thiscase, month): void{
      if (this.date.getDate() == thiscase.date.date && month == thiscase.date.month){
        console.log("Sumo Dias");
        this.countDay++;
      }
      
    }

    addCountWeek(thiscase, monday, month2): void{
      if (this.date.getDate() == thiscase.date.date && this.date.getDay() == 1){
        console.log("Sumo Semana por que es el primer dia de la semana");
        this.countWeek++;
      }

      else if(thiscase.date.date >= 26 && thiscase.date.day < 4 && thiscase.date.day != 0 && thiscase.date.month == month2){
        console.log("Sumo Semana por que dio negativo el dia");
        this.countWeek++;
      }
      else if(thiscase.date.date >= monday)
      {
        console.log("Sumo Semana normal el dia");
        this.countWeek++;
      }
    }

  cleanCount():void{
    this.countDay = 0;
    this.countWeek = 0;
  }

    filterDay(thiscase): void{
      console.log("este es el caso que se envia que se enviar dentro de la funcion Filterday ", thiscase.date.date);
      var count = [{}];
      var month = this.date.getMonth() + 1;
      var month2 = this.date.getMonth();
      if(month == 0)
      {
        console.log("Entro a month == 0");
        month2 == 12
      }
      var monday = (this.date.getDate() - this.date.getDay()) +1;
      console.log("monday", monday);
      if(monday <= 0)
      {
        console.log("Entro a monday <= 0");
        monday = 27;
      }

      this.addCountDay(thiscase, month);
      this.addCountWeek(thiscase, monday, month2)


    
      }


    getAllEng(): Observable<engineer>{
      var count;
      this.service.getAllEngineers()
      .subscribe(data => {
        this.aux = data;
        this.data = data;
        for(let i in this.aux){
          for(let j in this.aux[i].cases_loaded){
            console.log("Esta es J: " +j);
            this.filterDay(this.aux[i].cases_loaded[j]);
          }
          console.log("CountDay", this.countDay);
          console.log("CountWeek", this.countWeek);
          this.data[i].countday = this.countDay;
          this.data[i].countweek = this.countWeek;
          this.cleanCount;
        }
        
        console.log("esto es this.data ", this.data);
      })

      
      return;
    }


    addTicket(id): Observable<any>{
      console.log(id);
      this.service.addTickets(id)
      .subscribe(msj => {
        if(msj.status != 204)
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
    this.getAllEng();
  }

}
