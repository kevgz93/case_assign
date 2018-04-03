import { Component, OnInit } from '@angular/core';
import {ApiService} from '../api.service';
import { Observable } from 'rxjs/Observable';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {

  myform: FormGroup;

  constructor(private service: ApiService, private router:Router, private fb: FormBuilder) { }

  getUsers(){
    console.log("entro para traerse los ususarios");
    this.service.getAllUsers()
    .subscribe(data => {
      console.log(data);
    })

  }
  
  getTickets(){
    this.service.getAllEngineers()
      .subscribe(data => {

      })
  }

  ngOnInit() {
    this.getUsers;
    this.myform= this.fb.group({
      user: '',
      month: '',
      year: '',
      status: '',
      start_day : '',
      end_day: ''

    });
  }

}
