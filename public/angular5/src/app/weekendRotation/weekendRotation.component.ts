import { Component, OnInit } from '@angular/core';
import {ApiService} from '../api.service';
import { Observable } from 'rxjs/Observable';
import { NgModel } from '@angular/forms';
import {FormBuilder, FormGroup, Validators, FormControl, ReactiveFormsModule} from '@angular/forms';
import {Router} from '@angular/router';
declare var jquery:any;
declare var $ :any;

@Component({
  selector: 'app-rotation',
  templateUrl: './weekendRotation.component.html',
  styleUrls: ['./weekendRotation.component.scss']
})

export class WeekendRotationComponent implements OnInit {

  private week;
  public showtable: Boolean = false;

  constructor(private service: ApiService, private router:Router) { }


  getWeek(): Observable<object>{
    this.service.getWeek()
    .subscribe(week => {
      if(week.status != 200){
        alert("error finding week");
      }
      else{
        this.week = week.body;
        this.showtable = true;
      }
    })

    return;
  }





  ngOnInit() {
    this.getWeek();
    $('#queue_monitors_tab').removeClass('active');
  }

}
