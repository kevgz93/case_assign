import { Component, OnInit } from '@angular/core';
import {ApiService} from '../api.service';
import { Observable } from 'rxjs/Observable';
import { NgModel } from '@angular/forms';
import {FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import {Router} from '@angular/router';
import {IMyDpOptions} from 'mydatepicker';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss']
})
export class ScheduleComponent implements OnInit {

  public myDatePickerOptions: IMyDpOptions = {
    // other options...
    dateFormat: 'dd/mm/yyyy',
};
  public data;
  public user;
  public mjs;
  private showcalen = false;
  myform: FormGroup;

  constructor(private service: ApiService, private fb: FormBuilder, private router:Router) { }

  addSchedule(data){
    data.user_id = this.user.user._id;
    //data.day_off = data.day_off.formatted;
    //data.day_on = data.day_on.formatted;

    console.log("schedule ", data);
    this.service.addSchedule(data)
    .subscribe(msj => {
      console.log(msj);
      if(msj.status == 201){
        alert('Schedule Added');
        this.router.navigate(['./home']);
        
      }
      else{
        alert('schedule Failed');
        this.router.navigate(['./schedule']);
      }
    })
    
  }

  showCalendar():Boolean {
    this.showcalen = true;
    return
  }


  ngOnInit() {

    this.service.currentObject.subscribe(message => this.user = message);

    this.myform= this.fb.group({
      monday_morning: '',
      monday_afternoon: '',
      tuesday_morning: '',
      tuesday_afternoon : '',
      wednesday_morning: '',
      wednesday_afternoon: '',
      thursday_morning: '',
      thursday_afternoon: '',
      friday_morning: '',
      friday_afternoon: '',
      //day_on:[null, Validators.required],
      //day_off: [null, Validators.required]

    });
    
  }

}
