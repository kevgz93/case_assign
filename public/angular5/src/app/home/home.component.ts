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
  

  constructor(private service: ApiService) { }

    // Simulate GET /todos

    filterDay(thiscase): any{

      return
    }


    getAllEng(): Observable<engineer>{
      this.service.getAllEngineers()
      .subscribe(data => {
        console.log(Object.keys(data).length);
        this.aux = data;
        for(let i in this.aux){
          for(let j in this.aux[i]){
            this.filterDay(this.aux[i].cases_loaded[j]);
          }
        }
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
