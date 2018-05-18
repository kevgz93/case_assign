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
  public showtable:Boolean = false;

  constructor(private service: ApiService, private router:Router) { }


  getWeek(): Observable<object>{   
    this.service.getWeek()
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


  


  ngOnInit() {
    this.getWeek();
  }

}
