import { Component, OnInit } from '@angular/core';
import {ApiService} from '../api.service';
import { Observable } from 'rxjs/Observable';
import { NgModel } from '@angular/forms';
import {FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import {Router} from '@angular/router';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss']
})
export class ScheduleComponent implements OnInit {

  public data;
  public user;
  public mjs;
  myform: FormGroup;

  constructor(private service: ApiService, private fb: FormBuilder, private router:Router) { }

  addSchedule(data){
    data.time = +data.time;
    data.sta_dyn = +data.sta_dyn;
    data.max = +data.max;

    console.log(data);
    this.service.addUser(data)
    .subscribe(msj => {
      console.log(msj);
      if(msj.status == 201){
        alert('Schedule Added');
        
      }
      else{
        alert('schedule Failed');
        this.router.navigate(['./schedule]']);
      }
    })
    this.router.navigate(['./home]']);
  }

  ngOnInit() {

    this.service.currentMessage.subscribe(message => this.user = message);
    console.log("user_id ",this.user._id);

    this.myform= this.fb.group({
      lunes_morning: '',
      lunes_afternoon: '',
      martes_morning: '',
      martes_afternoon : '',
      miercoles_morning: '',
      miercoles_afternoon: '',
      jueves_morning: '',
      jueves_afternoon: '',
      viernes_morning: '',
      viernes_afternoon: '',

    });
  }

}
