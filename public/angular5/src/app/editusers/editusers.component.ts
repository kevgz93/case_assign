import { Component, OnInit, TemplateRef } from '@angular/core';
import { ApiService } from '../api.service';
import { Observable } from 'rxjs/Observable';
import { NgModel } from '@angular/forms';
import { FormBuilder, FormGroup, Validators, FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { promise } from 'protractor';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

declare var jquery: any;
declare var $: any;

@Component({
  selector: 'app-editusers',
  templateUrl: './editusers.component.html',
  styleUrls: ['./editusers.component.scss']
})
export class EditusersComponent implements OnInit {
  private users;
  private user;
  private showtable: Boolean = false;
  modalRef: BsModalRef;

  constructor(private service: ApiService, private router: Router, private modalService: BsModalService) { }

  openModal(template: TemplateRef<any>, user) {
    this.modalRef = this.modalService.show(template);
    console.log("user", user);
    this.user = user;
  }
//delete user
  delete(){
    let data = {id:"", schedule_id:""};
    console.log("schedule_loaded",this.user.schedule_loaded)
    this.user.schedule_loaded.forEach(schedule => {
      data.schedule_id = schedule._id
    });
    console.log("id del schedule", data.schedule_id)
    
    data.id = this.user._id;
    //data.schedule_id = this.users.schedule_loaded;

    this.service.deleteOneUser(data)
    .subscribe(response =>{
      console.log("dialog", response);
      if(response.status != 204){
        alert("User not deleted")
      }
      this.modalRef.hide();
    });
    
  }

  getUsers(): Observable<object> {
    this.service.getAllUsers()
      .subscribe(users => {
        console.log(users);
        //this.schedule = schedule.body;
        this.users = users;
        this.showtable = true;
      })
    return;
  }
  goToUser(id) {
    console.log(id)
    this.service.changeUserId(id);
    this.router.navigate(['./editengineer'])
  }

  goToSchedule(id) {
    console.log(id)
    this.service.changeUserId(id);
    this.router.navigate(['./editschedule'])
  }

  ngOnInit() {
    this.getUsers();
    $('#queue_monitors_tab').removeClass('active');
  }

  ngAfterViewChecked(){
    $('[data-toggle="tooltip"]').tooltip();
  }
}
