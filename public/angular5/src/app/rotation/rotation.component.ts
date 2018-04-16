import { Component, OnInit } from '@angular/core';
import {ApiService} from '../api.service';
import { Observable } from 'rxjs/Observable';
import { NgModel } from '@angular/forms';
import {FormBuilder, FormGroup, Validators, FormControl, ReactiveFormsModule} from '@angular/forms';
import {Router} from '@angular/router';

@Component({
  selector: 'app-rotation',
  templateUrl: './rotation.component.html',
  styleUrls: ['./rotation.component.scss']
})

export class RotationComponent implements OnInit {
  
  private week;
  private showtable;

  constructor(private service: ApiService, private router:Router) { }


  checkWeek():Observable<Response>{
    let date = new Date();
    let days = date.getDate();
    let monday = this.getMonday(new Date());
    let week;
    this.service.getWeekByStatus().subscribe(data =>{
    week = data.body;
    console.log(week.active.day);
    if(days === monday.getDate() && week.active.day != days){
      this.changeDayWeek(days, week.week)
    }
    else {
      this.getWeek(week.week);
    }
    })
    return
  }

  changeDayWeek(day, week):Observable<Boolean>{
    this.service.updateDayOnWeek(day, week).subscribe(response => {
      this.getWeek(week + 1);
      console.log(response);
    })
    return
  }

  getWeek(weekNumber): Observable<object>{   
    this.service.getWeek(weekNumber)
    .subscribe(week => {
      if(week.status != 200){
        alert("error finding week");
      }
      else{
        console.log(week.body);
        this.week = week.body;
        this.showtable = true;
      }
    })
    
    return;
  }

  getMonday(d) {
    d = new Date(d);
    var day = d.getDay(),
        diff = d.getDate() - day + (day == 0 ? -6:1); // adjust when day is sunday
    return new Date(d.setDate(diff));
  }
  


  ngOnInit() {
    this.showtable = false;
    this.checkWeek();
  }

}
