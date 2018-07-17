import { Component, OnInit, TemplateRef } from '@angular/core';
import { ApiService } from '../api.service';
import { Observable } from 'rxjs/Observable';
import { NgModel } from '@angular/forms';
import { FormBuilder, FormGroup, Validators, FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { promise } from 'protractor';
import { IMyDrpOptions, MYDRP_VALUE_ACCESSOR } from 'mydaterangepicker';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { ConvertTimeZero } from './../lib/Time_zero'

declare var jquery: any;
declare var $: any;

@Component({
  selector: 'app-timeoff',
  templateUrl: './timeoff.component.html',
  styleUrls: ['./timeoff.component.scss']
})
export class TimeoffComponent implements OnInit {

  private showview: boolean = false;
  private user_id;
  private _id;
  private times;
  private myform: FormGroup;
  private myform2: FormGroup;
  //create instance on lib folder
  private convertTimeZone = new ConvertTimeZero();
  public myDateRangePickerOptions: IMyDrpOptions = {
    // other options...
    dateFormat: 'dd/mm/yyyy',
  };
  private modalRef: BsModalRef;

  constructor(private service: ApiService, private fb: FormBuilder, private router: Router, private modalService: BsModalService) { }

  //Open modal for modify
  openModalModify(template: TemplateRef<any>, time) {
    console.log("values before to open modal", time);
    this._id = time._id;
    this.fillForm(time);
    this.modalRef = this.modalService.show(template);
  }

  //Open modal for delete
  openModalDelete(template2: TemplateRef<any>, _id) {
    console.log("values before to open modal", _id);
    this.fillForm2(_id);
    this.modalRef = this.modalService.show(template2);
  }

  //change time off month to string
  convertMonthString(times): Object {
    let result = times;
    let index;
    let months = ["Jan", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Aug", "Set", "Oct", "Nov", "Dic"]
    times.forEach(element => {
      index = element.day_off.month - 1;
      element.day_off.monthString = months[index];
      if (element.day_off.minutes === 0) {
        element.day_off.minutesString = `${element.day_off.minutes}0`
      }
      index = element.day_on.month - 1;
      element.day_on.monthString = months[index];
      if (element.day_on.minutes === 0) {
        element.day_on.minutesString = `${element.day_on.minutes}0`
      }
      result.element = element;

    });
    return result
  }

  //get the times for the user
  getTime(): void {

    this.service.getTimes(this.user_id).subscribe(response => {
      if (response.status != 204) {
        alert("Issue loading time off");
      }
      else {
        let time = this.convertTimeZone.convertFromTimeOffLocally(response.body);
        this.times = this.convertMonthString(time);
        this.showview = true;

      }

    })
  }

  // Update time off method
  updateTimeOff(data): Observable<Object> {
    console.log("Values from the form", data);
    let difference = { "hour": 0, "minutes": 0 }
    difference = this.convertTimeZone.getLocalDifference();
    let sendData = {
      "_id": "", "reason": "", "reason_delete_modify": "", "difference": { "hour": 0, "minutes": 0 }, "day_off": { "day": 0, "month": 0, "year": 0, "hour": 0, "minutes": 0 },
      "day_on": { "day": 0, "month": 0, "year": 0, "hour": 0, "minutes": 0 }
    };
    sendData._id = this._id;
    sendData.reason = data.time_off_reason;
    sendData.reason_delete_modify = data.time_off_reasonMD;
    sendData.day_off.day = data.myDateRange.beginDate.day;
    sendData.day_off.month = data.myDateRange.beginDate.month;
    sendData.day_off.year = data.myDateRange.beginDate.year;
    sendData.day_off.hour = parseInt(data.start_time_hour);
    sendData.day_off.minutes = parseInt(data.start_time_minutes);
    sendData.day_on.day = data.myDateRange.endDate.day;
    sendData.day_on.month = data.myDateRange.endDate.month;
    sendData.day_on.year = data.myDateRange.endDate.year;
    sendData.day_on.hour = parseInt(data.end_time_hour);
    sendData.day_on.minutes = parseInt(data.end_time_minutes);
    sendData.difference.hour = difference.hour;
    sendData.difference.minutes = difference.minutes;
    this.service.updateTimeOff(sendData)
      .subscribe(response => {
        if (response.status === 204) {
          alert("Time off Modified");
          this.modalRef.hide();
          this.ngOnInit();
        }
        else {
          alert("Time off not added, please contact your administrator")
        }
      })
    return
  }

  // Update time off method
  deleteTimeOff(data): Observable<Object> {
    console.log("Delete from the form2", data);

    this.service.deleteTimeOff(data)
      .subscribe(response => {
        if (response.status === 204) {
          this.modalRef.hide();
          this.ngOnInit();
        }
        else {
          alert("Time off not added, please contact your administrator")
        }
      })
    return
  }

  //Fill form for modal for modify
  fillForm(time): void {

    this.myform.patchValue({
      myDateRange: {
        beginDate: {
          year: time.day_off.year,
          month: time.day_off.month,
          day: time.day_off.day
        },
        endDate: {
          year: time.day_on.year,
          month: time.day_on.month,
          day: time.day_on.day
        }


      },
      time_off_reason: time.reason,
      time_off_reasonMD: "",
      start_time_hour: time.day_off.hour,
      start_time_minutes: time.day_off.minutes,
      end_time_hour: time.day_on.hour,
      end_time_minutes: time.day_on.minutes

    });
  }

  //Fill form for modal Delet
  fillForm2(_id): void {

    this.myform2.patchValue({
      _id: _id,
      time_off_reasonMD: ""

    });
  }

  ngAfterViewChecked() {
    $('[data-toggle="tooltip"]').tooltip();
  }
  ngOnInit() {
    this.myform = this.fb.group({

      myDateRange: ['', Validators.required],
      start_time_hour: ['', Validators.required],
      start_time_minutes: ['', Validators.required],
      end_time_hour: ['', Validators.required],
      end_time_minutes: ['', Validators.required],
      time_off_reason: ['', Validators.required],
      time_off_reasonMD: ['', Validators.required]


    });
    this.myform2 = this.fb.group({

      time_off_reasonMD: ['', Validators.required],
      _id: ['', Validators.required]


    });

    this.service.currentId.subscribe(message => this.user_id = message);
    this.getTime();

    $('#queue_monitors_tab').removeClass('active');
  }

}
