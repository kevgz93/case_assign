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
  public users;
  public months;

  constructor(private service: ApiService, private router:Router, private fb: FormBuilder) { }

  getUsers(){
    this.service.getAllUsers()
    .subscribe(data => {
      console.log(data);
      this.users = data;
    })
    return;
  }
  
  getTickets(form){
    console.log(form);
    /* this.service.getAllEngineers()
      .subscribe(data => {

      }) */
  }

  ngOnInit() {
    this.months = [{"id": 1, "name":"January"},{"id": 2, "name":"February"},{"id": 3, "name":"March"},{"id": 4, "name":"Abril"},
    {"id": 5, "name":"May"},{"id": 6, "name":"June"},{"id": 7, "name":"July"},{"id": 8, "name":"August"},{"id": 9, "name":"September"},
    {"id": 10, "name":"October"},{"id": 11, "name":"November"},{"id": 12, "name":"December"}];
    this.getUsers();
    this.myform= this.fb.group({
      user: '',
      month: '',
      case_status: '',

    });
  }

}
