import { Component, OnInit } from '@angular/core';
import {ApiService} from '../api.service';
import { Observable } from 'rxjs/Observable';
import { NgModel } from '@angular/forms';
import {FormBuilder, FormGroup, Validators, FormControl, ReactiveFormsModule} from '@angular/forms';
import {Router} from '@angular/router';


@Component({
  selector: 'app-scheduleedit',
  templateUrl: './scheduleedit.component.html',
  styleUrls: ['./scheduleedit.component.scss']
})
export class ScheduleeditComponent implements OnInit {

  public id;
  public schedule;
  private showhtml;
  rForm: FormGroup;
  myform: FormGroup;

  constructor(private service: ApiService, private fb: FormBuilder, private router:Router) { }

  getSchedule(): Observable<object>{
    this.service.getSchedule(this.id)
    .subscribe(schedule => {
      if(schedule.status != 200){
        alert("error finding user");
      }
      else{
        console.log(schedule);
        this.schedule = schedule;
        this.fillForm();
        this.showhtml = true;
      }
    })
    
    return;
  }

  updateSchedule(data){
    data._id = this.id;
    this.service.updateSchedule(data)
    .subscribe(response => {
      console.log(response.status);
      if(response.status != 204){
        alert("error finding user");
      }
      else{
        alert("Schedule updated");
        this.router.navigate(['./home'])
      }
  })

  return;
}

  fillForm(){

    this.myform= this.fb.group({
      
      monday_morning : this.schedule.body.monday_morning,
      monday_afternoon : this.schedule.body.monday_afternoon,
      tuesday_morning: this.schedule.body.tuesday_morning,
      tuesday_afternoon: this.schedule.body.tuesday_afternoon,
      wednesday_morning: this.schedule.body.wednesday_morning,
      wednesday_afternoon: this.schedule.body.wednesday_afternoon,
      thursday_morning : this.schedule.body.thursday_morning,
      thursday_afternoon : this.schedule.body.thursday_afternoon,
      friday_morning: this.schedule.body.friday_morning,
      friday_afternoon: this.schedule.body.friday_afternoon,
      day_off: this.schedule.body.day_off,
      day_on : this.schedule.body.day_on,
    });
  }

  ngOnInit() {
    this.showhtml = false;
    this.service.currentId.subscribe(message => this.id = message);
    this.getSchedule();
  }

}
