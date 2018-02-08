import { Component, OnInit } from '@angular/core';
import {ApiService} from '../api.service';
import { Observable } from 'rxjs/Observable';
import { NgModel } from '@angular/forms';
import {FormBuilder, FormGroup, Validators, FormControl, ReactiveFormsModule} from '@angular/forms';

interface engineer{
  _id : string;
	eng_name : String,
  last_name : String,
  email: String,
  city : String,
  work_start: Number,
  work_end: Number,
  time_zone: Number,
  sta_dyn: Number,
  max_case: Number,
  status: Boolean,
  day: Number,
  week: Number,
  month: Number
};

@Component({
  selector: 'app-engineer',
  templateUrl: './EditEngineer.component.html',
  styleUrls: ['./EditEngineer.component.scss']
})



export class EngineerComponent implements OnInit {

  public eng = null;
  public data;
  rForm: FormGroup;
  
  

  constructor(private service: ApiService, private fb: FormBuilder) { 
    /*this.rForm = fb.group({
      'eng_name' : [null,Validators.required],

    });*/
  }

  getAllEngi(): Observable<engineer>{
    this.service.getAllEngineers()
    .subscribe(eng => {
      this.eng = eng;
    })
    
    return;
  }

  getOneEng(id): Observable<engineer>{
    console.log("este es el ID "+ id);
    this.service.getOneEngineers(id)
    .subscribe(data => {
      console.log(data);
      if(data.status){
        this.data = data;
        this.data.status = 'available';
    }
    else{
      this.data = data;
      this.data.status = 'unavailable';
    }
})
    
    return;
  }

  addEngineer(data){
    console.log(data);
  }

  ngOnInit() {
    this.getAllEngi();
  }

}
