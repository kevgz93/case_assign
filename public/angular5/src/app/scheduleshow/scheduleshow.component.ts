import { Component, OnInit } from '@angular/core';
import {ApiService} from '../api.service';
import { Observable } from 'rxjs/Observable';
import { NgModel } from '@angular/forms';
import {FormBuilder, FormGroup, Validators, FormControl, ReactiveFormsModule} from '@angular/forms';
import {Router} from '@angular/router';

@Component({
  selector: 'app-scheduleshow',
  templateUrl: './scheduleshow.component.html',
  styleUrls: ['./scheduleshow.component.scss']
})
export class ScheduleshowComponent implements OnInit {


  public schedule;
  private showschedule:boolean = false;
  private id;

  constructor(private service: ApiService, private router:Router) { }

  //converting to the current timezone

//get the schedule
  getSchedule(): Observable<object>{
    this.service.getSchedule(this.id)
    .subscribe(schedule => {
      if(schedule.status != 200){
        alert("error finding user");
      }
      else{
        console.log(schedule);
         this.schedule = schedule.body;
         this.showschedule = true;
      }
    })
    
    return;
  }

  ngOnInit() {
    this.service.currentId.subscribe(message => this.id = message);
    this.getSchedule();
  }

}
