import { Component, OnInit } from '@angular/core';
import {ApiService} from '../api.service';
import { Observable } from 'rxjs/Observable';
import { NgModel } from '@angular/forms';
import {FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';

@Component({
  selector: 'app-addengineer',
  templateUrl: './addengineer.component.html',
  styleUrls: ['./addengineer.component.scss']
})
export class AddengineerComponent implements OnInit {

  public data;
  myform: FormGroup;
  
   
  constructor(private service: ApiService, private fb: FormBuilder) { 
  }

  addEngineer(data){
    data.work_start = +data.work_start;
    data.work_end = +data.work_end;
    data.time = +data.time;
    data.sta_dyn = +data.sta_dyn;
    data.max = +data.max;

    console.log(data);
    this.service.addEngineer(data)
    .subscribe(msj => {
      if(msj.status == 201){
        alert('Ingeniero Agregado');
      }
      else{
        alert('Ingeniero Agregado');
      }
    })
  }

  ngOnInit() {
    this.myform= this.fb.group({
      eng_name: '',
      last_name: '',
      email: '',
      city : '',
      work_start: '',
      work_end: '',
      time: '',
      sta_dyn: '',
      max: '',
      status: '',
    });
  }

}
