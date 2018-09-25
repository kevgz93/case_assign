import { Component, OnInit, TemplateRef } from '@angular/core';
import {ApiService} from '../api.service';
import { Observable } from 'rxjs/Rx';
import {take} from 'rxjs/operators';
import {Router} from '@angular/router';
import { promise } from 'protractor';
import {FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import {working_days} from './../lib/working_days';
import { case_average } from './../lib/case_average';
import {IsAvailable} from './../lib/isAvailable';
import { resolve } from 'dns';
import { reject } from 'q';


declare var jquery:any;
declare var $ :any;

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
  status: Boolean
};

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})


export class HomeComponent implements OnInit {
  private data = null;
  private status = null;
  public showhtml:Boolean=false;
  public loading:Boolean=true;
  private condition = {id:'', action:'disable'};
  private qm;
  private timezone = {};
  public today;
  public date = new Date();
  private workingDays = new working_days();
  private average = new case_average(this.service);
  public isAvailable = new IsAvailable()
  public interval;
  myform: FormGroup;
  modalRef: BsModalRef;


  constructor(private service: ApiService, private fb: FormBuilder, private router:Router, private modalService: BsModalService) { 
    
    // Observable.timer(30000, 30000).pipe(
    //   take(3)).subscribe(x=>{
    //     this.refreshHome();
    //    })

    let timer = Observable.timer(30000, 30000);
    this.interval = timer.subscribe(t=> {
      this.refreshHome();
    });
  }

    // Simulate GET /todos




  filterDay(cases){
    let date = new Date();
    var count = {"day":0,"week":0,"month":0};
    var monday;
    var month = date.getMonth() + 1;
    var month2 = date.getMonth();
    let countDay = 0;
    let countWeek = 0;
    let countMonth = 0;
    if(month == 0)
    {
      month2 == 12
    }

    //***************** clousers ***************************

    let getMonday = function (d) {
      d = new Date(d);
      var day = d.getDay(),
          diff = d.getDate() - day + (day == 0 ? -6:1); // adjust when day is sunday
      return new Date(d.setDate(diff));
    }

    let addCountDay = function(thiscase, month): void{
      if (date.getDate() == thiscase.date.date && month == thiscase.date.month){
        count.day++;
      }

    }

    let addCountWeek = function(thiscase, monday): void{
      var current_month = monday.getMonth() + 1;
      var next_month = monday.getMonth() + 2;
      if (thiscase.date.date >= monday.getDate()  && thiscase.date.month == current_month){
        count.week++;
      }
      else if(thiscase.date.month == next_month && thiscase.date.date < 5){
        count.month++;
      }

    }



    let addCountMonth = function(thiscase, month): void{
      if (month == thiscase.date.month ){
        count.month++;
      }

    }

    //********************************************************************

    monday = getMonday(new Date());

    cases.forEach(cas => {
  
  
      addCountDay(cas, month);
      addCountWeek(cas, monday)
      addCountMonth(cas, month);
    });



    return count;

  }


      //check and send if need to changes working days on database
      working_days(timeoff, working_days, timeoff_status, id):Promise<object>{
        let result:any
        let date = new Date();
        let current_month = date.getMonth()+1;
        var promise = new Promise((resolve,reject) => {
          // if time off is null
          if(Object.keys(timeoff).length === 0){
            let current_month = this.date.getMonth() + 1;
            timeoff = {"day_off":{"month":current_month},"day_on":{"day":0}};
          }

          //if there are timeoff with different month
        if(date.getDate() <= 3 && working_days.next_month_status){
          //services to changes working days
          this.service.case_average_next_month(id).subscribe(data =>{
            if (data.status != 204){
              alert("error with case average, please contact the administrator");
            }
            result =  data.body;
            resolve(result);
          })
        }

        //when a time off start on the same month
        else if(timeoff_status && !working_days.status){
          let response = this.workingDays.working_days(timeoff);
          //services to changes working days
          this.service.case_average_add({"_id":id,"working_days":response, "reference":timeoff._id}).subscribe(data =>{
            if (data.status != 204){
              alert("error with case average, please contact the administrator");
            }
            result =  data.body;
            resolve(result);
          })
        }
        
        //when the time off end
        else if(!timeoff_status && working_days.status){
          this.service.case_average_endTimeoff({"_id":id}).subscribe(data =>{
            if (data.status != 204){
              alert("error with case average, please contact the administrator");
            }
            result =  data.body;
            resolve(result);
          })
        }
        
        else{
          result =  working_days;
          resolve(result);
        }

        })
        

        return promise;
      }
      




      //convert to string static and dynamic
      convertStaDyn(value):String{
        let string;
        if(value === 1){
           string = "Static";
        }
        else if(value === 2){
           string = "Dynamic";
        }
        else {
           string = "Both";
        }
        return string;
      }


      addTimeZone(time):String{
        if (time === "cat"){
          return "Central America Time Zone"
        }
        else if (time === "pt"){
          return "Pacific Time Zone"
        }
        else if (time === "mt"){
          return "Mountain Time Zone"
        }
        else if (time === "ct"){
          return "Central Time Zone"
        }
        else if (time === "et"){
          return "Eastern Time Zone"
        }
        else if (time === "uk"){
          return "UK Time Zone"
        }
        else if(time === "cet"){
          return "Central European Time Zone"
        }
        else if(time === "ist"){
          return "Indian Standard Time Zone"
        }
        else if(time === "ict"){
          return "Indochina Time Zone"
        }
        else if(time === "sgt"){
          return "Singapore Time Zone";
        }
        else if(time === "jst"){
          return "Japan Time Zone"
        }
        else{
          return "et";
        }

      }


    getAllEng(): Observable<engineer>{
      var aux = {};
      var count;
      this.service.getAllEngineers()
      .subscribe( async data => {
        if(data.status == 401)
        {
          this.router.navigate(['./'])
        }
        
        aux = data;
        this.data = data;
        this.data.forEach(async engi =>{
          engi.time_zone = this.addTimeZone(engi.schedule_loaded[0].time_zone);
          engi.sta_dyn = this.convertStaDyn(engi.sta_dyn);
          engi.cases = this.filterDay(engi.cases_loaded)
          engi.today = this.isAvailable.filterScheduleTodayDay(engi);
          engi.disableAddButton = this.disableAddButton(engi.max_case, engi.cases.day);
          engi.disableLessButton = this.disableLessButton(engi.last_case, engi.cases_loaded);
          engi.working_days = await this.working_days(engi.today.timeoff.timeoff,engi.working_days,engi.today.timeoff.status, engi._id);
          
        });
        //this.data = this.sortable(this.data);
        
        await this.data.sort(function(a, b)
        {
          return a.today.morning-b.today.morning;
        });

        await this.average.average(this.data).then(result => {
          this.data = result;
          this.loading=false;
          this.showhtml = true;
        });

      })

      

      return;
    }


    addTicket(id, engi_name, engi_last):void{
      let user;
      this.condition.id = id;
      this.condition.action = "enable";
      this.service.getUserBySessionId().subscribe(response => {
        user = response.body;
        const body = JSON.stringify({"engi_id": id,"engi_name":engi_name,"engi_last_name":engi_last,
         "user_id": user._id,"user_name":user.name,"user_last_name":user.last_name});
        this.service.addTickets(body).subscribe(response =>{
          let ticket;
          ticket = response;
          if (ticket.action === "added"){
            this.getAllEng();
          }
          else
            alert("cases not added");
        });
      });
    }


    deleteTicket(data): Observable<any>{
      this.condition.id = data.id;
      this.condition.action = "disable";
      this.service.deleteTickets(data)
      .subscribe(msj => {
        this.modalRef.hide();
        this.getAllEng();
      })

      return;
    }
    //get qm from emea

    currentQmEmea(week):string{
      let date = new Date;
      let day = date.getDay();
      if(day ===1 ){
        return week.monday.emea;
      }
      else if(day ===1 ){
        return week.monday.emea;
      }
      else if(day ===2 ){
        return week.tuesday.emea;
      }
      else if(day ===3 ){
        return week.wednesday.emea;
      }
      else if(day ===4 ){
        return week.thursday.emea;
      }
      else if(day ===5){
        return week.friday.emea;
      }

    }
    //get qm from america
    currentQmAms(week):string{
      let date = new Date;
      let day = date.getDay();
      let time = date.getHours();
      if(day ===1 && time <12){
        return week.monday.morning;
      }
      else if(day ===1){
        return week.monday.afternoon;
      }
      else if(day ===2 && time < 12){
        return week.tuesday.morning;
      }
      else if(day ===2){
        return week.tuesday.afternoon;
      }
      else if(day ===3 && time <12){
        return week.wednesday.morning;
      }
      else if(day ===3){
        return week.wednesday.afternoon;
      }
      else if(day ===4 && time <12){
        return week.thursday.morning;
      }
      else if(day ===4){
        return week.thursday.afternoon;
      }
      else if(day ===5 && time <12){
        return week.friday.morning;
      }
      else if(day ===5){
        return week.friday.afternoon;
      }

    }

    //add the corresponding QM
    currentQM(week):void{
      let date = new Date;
      let timezone = date.getTimezoneOffset() / 60; 
      if(timezone < 4){
        this.qm = this.currentQmEmea(week);
      }
      else{
        this.qm = this.currentQmAms(week);
      }

    }

    //Get the current QM
    getQM():void{
    let week;
    this.service.getWeekByStatus().subscribe(data =>{
      week = data.body;
      if(data.status === 200){
        this.currentQM(week)
      }
      else {
        this.qm = "Error";
      }
        })

    }

    disableAddButton(max, countday): boolean{
      if (countday >= max && max !== 0){
        return true;
      }
      return false;
    }

    disableLessButton(last_case, cases): boolean{
      let value = true;
      cases.forEach(element => {
        if (element._id === last_case ){
          value = false;
        }

      });
      

      return value;
    }

    //refres home
    refreshHome(){
      this.getAllEng();
        //this.data = this.sortable(this.data);

    }


    //Open Modal and fill from

    //Open Modal
    openModal(template: TemplateRef<any>, id) {
      this.fillForm(id);
      this.modalRef = this.modalService.show(template);
    }

    //Fill the form group
    fillForm(id){
      this.myform= this.fb.group({
        id: id,
        delete_reason: ''
      });
    }

    async delay(ms: number) {
      await new Promise( resolve => setTimeout(resolve, ms) );
  }

  ngOnInit() {
    //this.showhtml = false;
    
    this.getQM();
    this.getAllEng();

    $('#queue_monitors_tab').removeClass('active');
  }

  ngOnDestroy() {
    this.interval.unsubscribe();
  }

  ngAfterViewChecked(){
    $('[data-toggle="tooltip"]').tooltip();
  }
}
