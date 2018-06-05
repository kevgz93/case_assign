import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { Observable } from 'rxjs/Observable';
import { NgModel } from '@angular/forms';
import { FormBuilder, FormGroup, Validators, FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
declare var jquery: any;
declare var $: any;
$('#queue_monitors_tab').removeClass('active');

@Component({
  selector: 'app-rotationedit',
  templateUrl: './rotationedit.component.html',
  styleUrls: ['./rotationedit.component.scss']
})
export class RotationeditComponent implements OnInit {

  //public week;
  public rotation;
  private showtable: Boolean = false;
  rForm: FormGroup;
  myform: FormGroup;

  constructor(private service: ApiService, private fb: FormBuilder, private router: Router) { }


  getWeek(week): Observable<object> {
    this.service.getRotation(week)
      .subscribe(rotation => {
        if (rotation.status != 200) {
          alert("error finding week");
        }
        else {
          //console.log(rotation.body);
          this.rotation = rotation.body;
          this.fillForm(rotation.body);
          this.showtable = true;
        }
      })

    return;
  }


  updateRotation(data) {
    //console.log(data);
    this.service.updateRotation(data)
      .subscribe(response => {
        //console.log(response.status);
        if (response.status != 204) {
          alert("error finding user");
        }
        else {
          alert("Rotation updated");
          this.getWeek(response.body);
        }
      })

    return;
  }

  fillForm(rotation) {
    this.myform = this.fb.group({
      week: rotation.week,
      monday_morning: rotation.monday.morning,
      monday_afternoon: rotation.monday.afternoon,
      monday_emea: rotation.monday.emea,
      tuesday_morning: rotation.tuesday.morning,
      tuesday_afternoon: rotation.tuesday.afternoon,
      tuesday_emea: rotation.tuesday.emea,
      wednesday_morning: rotation.wednesday.morning,
      wednesday_afternoon: rotation.wednesday.afternoon,
      wednesday_emea: rotation.wednesday.emea,
      thursday_morning: rotation.thursday.morning,
      thursday_afternoon: rotation.thursday.afternoon,
      thursday_emea: rotation.thursday.emea,
      friday_morning: rotation.friday.morning,
      friday_afternoon: rotation.friday.afternoon,
      friday_emea: rotation.friday.emea
    });


  }

  ngOnInit() {
    //this.service.currentId.subscribe(message => this.id = message);
    $('#queue_monitors_tab').removeClass('active');
  }

}

