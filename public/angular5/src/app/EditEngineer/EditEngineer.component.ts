import { Component, OnInit } from '@angular/core';
import {ApiService} from '../api.service';
import { Observable } from 'rxjs/Observable';
import { NgModel } from '@angular/forms';
import {FormBuilder, FormGroup, Validators, FormControl, ReactiveFormsModule} from '@angular/forms';

interface engineer{
	name : String,
	last_name : String,
	username: String,
	password: String,
	email: String,
	city : String,
	time_zone: Number,
	sta_dyn: Number,
	max_case: Number,
	status: Boolean,
	activeSession: String,
	role: String,
	days_working: Number,
	last_case: String
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


  getOneEng(data): Observable<engineer>{
    console.log("Engineer "+ data);
    this.service.getOneEngineer(data)
    .subscribe(data => {
      console.log(data);
      if(data.status){
        
    }
    else{

    }
})
    
    return;
  }

  addEngineer(data){
    console.log(data);
  }

  ngOnInit() {

  }

}
