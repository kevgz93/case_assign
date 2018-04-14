import { Component, OnInit } from '@angular/core';
import {ApiService} from '../api.service';
import { Observable } from 'rxjs/Observable';
import { NgModel } from '@angular/forms';
import {FormBuilder, FormGroup, Validators, FormControl, ReactiveFormsModule} from '@angular/forms';
import {Router} from '@angular/router';

@Component({
  selector: 'app-rotationedit',
  templateUrl: './rotationedit.component.html',
  styleUrls: ['./rotationedit.component.scss']
})
export class RotationeditComponent implements OnInit {

  public week;
  public rotation;
  private showtable;
  rForm: FormGroup;
  myform: FormGroup;

  constructor(private service: ApiService, private fb: FormBuilder, private router:Router) { }


  getRotation(): Observable<object>{   
    this.service.getRotation()
    .subscribe(rotation => {
      if(rotation.status != 200){
        alert("error finding week");
      }
      else{
        console.log(rotation.body);
        this.rotation = rotation.body;
        this.showtable = true;
      }
    })
    
    return;
  }


  updateSchedule(data){
    data._id = this.week;
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
      
      monday_morning : this.rotation.body.monday_morning,
      monday_afternoon : this.rotation.body.monday_afternoon,
      tuesday_morning: this.rotation.body.tuesday_morning,
      tuesday_afternoon: this.rotation.body.tuesday_afternoon,
      wednesday_morning: this.rotation.body.wednesday_morning,
      wednesday_afternoon: this.rotation.body.wednesday_afternoon,
      thursday_morning : this.rotation.body.thursday_morning,
      thursday_afternoon : this.rotation.body.thursday_afternoon,
      friday_morning: this.rotation.body.friday_morning,
      friday_afternoon: this.rotation.body.friday_afternoon
      });
    }

  ngOnInit() {

    this.showtable = false;
    //this.service.currentId.subscribe(message => this.id = message);
    this.getRotation();
  }

}



  
