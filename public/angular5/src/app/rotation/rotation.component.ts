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
  

  constructor(private service: ApiService, private router:Router) { }
  private changed;

  CheckWeek():Observable<Response>{
    let date = new Date();
    let monday = this.getMonday(new Date());
    this.service.getWeekByStatus().subscribe(week =>{
    if(date.getDate() === monday.getDate() && this.changed != true){
      this.changed = true;
      week
      this.getWeek(week);
    }
    })
    return
  }

  getWeek(week): Observable<object>{
    
    
    this.service.getSchedule(week)
    .subscribe(schedule => {
      if(schedule.status != 200){
        alert("error finding user");
      }
      else{
        console.log(schedule);
        // this.schedule = schedule;
        // this.fillForm();
        // this.showhtml = true;
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
  }

}
