import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';

import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import {Router} from '@angular/router';

import {
  CalendarEvent,
  CalendarEventAction
} from 'angular-calendar';

const API_URL = environment.apiUrl;



@Injectable()
export class ApiService {

  constructor(
    private http: HttpClient, private cookieService: CookieService, private router:Router) {
  }
  public cookie;
  //private user_id;
  private user = new BehaviorSubject<object>({});
  currentObject = this.user.asObservable();

  private id = new BehaviorSubject<String>('');
  currentId = this.id.asObservable();


  // Calendar action
  // Redirect the user to edit the list of days were the worker will be on call.
  actions: CalendarEventAction[] = [
    {
      label: '<i class="qtm-font-icon qtm-icon-edit"></i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
          this.changeUserId(event.id.toString());
          this.router.navigate(['./editengineer']);
      }
    }
  ];


  //share user Id
  changeObject(message: Object) {
    this.user.next(message);
  }

  changeUserId(message: String) {
    this.id.next(message);
  }


  checkCookie():Observable<boolean>{
  let cookie;
   cookie = this.cookieService.get("SessionId");
   return cookie;
  }




  // API: GET /todos
  public getAllEngineers(): Observable<Response> {
    this.cookie = this.checkCookie();
    let params = new HttpParams().set("sessionid",this.cookie);
    return this.http
    .get(API_URL + '/api/ticket/', { params: params })
    .map(response => {
      return response
    })
    .catch(this.handleError);
  }

  public getUserBySessionId(): Observable<Response> {
    this.cookie = this.checkCookie();
    let parameter = new HttpParams().set("sessionid",this.cookie);
    return this.http
    .get(API_URL + '/api/check/', { params: parameter })
    .map(response => {
      //this.user_id = response;
      return response
    }) .catch(this.handleError);
  }

  public getAllUsers(): Observable<Response> {
    return this.http
    .get(API_URL + '/api/getusers')
    .map(response => {
      //this.user_id = response;
      return response
    }) .catch(this.handleError);
  }


  // API: GET one engineer
  public getOneEngineer(id): Observable<Response> {
    let params = new HttpParams().set("id",id);
    return this.http
    .get(API_URL + '/api/user/', { params: params })
    .map(response => {
      return response
    })
    .catch(this.handleError);
  }

  // API: Delete one engineer
  public deleteOneUser(data): Observable<Response> {
    let params = new HttpParams();
    params = params.append("id",data.id);
    params = params.append("schedule_id",data.schedule_id);
    params = params.append("sessionId",this.cookie);
    return this.http
    .delete(API_URL + '/api/user/' , { params: params}) //
    .map(response => {
      return response
    })
    .catch(this.handleError);
  }

  public getSchedule(id): Observable<Response> {
    let params = new HttpParams().set("id",id);
    return this.http
    .get(API_URL + '/api/schedule/', { params: params })
    .map(response => {
      return response
    })
    .catch(this.handleError);
  }

  public addTickets(body): Observable<any>{
    return this.http.post(API_URL + '/api/ticket', body,{headers: new HttpHeaders().set('Content-Type','application/json')}).map(tickt => {
      return tickt;
    }).catch(this.handleError);
  }

  public deleteTickets(data): Observable<Response> {
    let body = JSON.stringify({"engi_id": data.id, "delete_reason":data.delete_reason});
    return this.http
    .put(API_URL + '/api/ticket', body,
     {headers: new HttpHeaders().set('Content-Type','application/json')}) //{headers: new HttpHeaders().set('Content-Type','application/json')}
    .map(response => {

      return response
    })
    .catch(this.handleError);
  }


  public addUser(data): Observable<Response> {
    data.sessionId = this.cookie;
    let body = JSON.stringify(data);
    return this.http
    .post(API_URL + '/api/login/register', body,
    {headers: new HttpHeaders().set('Content-Type','application/json')})
    .map(response => {
      return response
    })
    .catch(this.handleError);
  }

  public updateUser(data): Observable<Response> {
    data.sessionId = this.cookie;
    let body = JSON.stringify(data);
    return this.http
    .put(API_URL + '/api/user', body,
    {headers: new HttpHeaders().set('Content-Type','application/json')})
    .map(response => {
      return response
    })
    .catch(this.handleError);
  }

  public updateUserWRDates(data): Observable<Response> {
    data.sessionId = this.cookie;
    let body = JSON.stringify(data);
    return this.http
      .put(API_URL + '/api/user/editWeekendRotationDates', body,
        {headers: new HttpHeaders().set('Content-Type','application/json')})
      .map(response => {
        return response
      })
      .catch(this.handleError);
  }

  public addSchedule(data): Observable<Response> {
    data.sessionId = this.cookie;
    let body = JSON.stringify(data);
    return this.http
    .post(API_URL + '/api/schedule', body,
    {headers: new HttpHeaders().set('Content-Type','application/json')})
    .map(response => {
      return response
    })
    .catch(this.handleError);
  }
  public updateSchedule(data): Observable<Response> {
    data.sessionId = this.cookie;
    let body = JSON.stringify(data);
    return this.http
    .put(API_URL + '/api/schedule', body,
    {headers: new HttpHeaders().set('Content-Type','application/json')})
    .map(response => {
      return response
    })
    .catch(this.handleError);
  }

  public getReportCase(data): Observable<Object> {
    data.sessionId = this.cookie;
    let body = JSON.stringify(data);
    return this.http
    .post(API_URL + '/api/reports/case', body,
    {headers: new HttpHeaders().set('Content-Type','application/json')})
    .map(response => {
      //this.user_id = response;
      return response
    }) .catch(this.handleError);
  }

  public getReportTimeoff(data): Observable<Object> {
    data.sessionId = this.cookie;
    let body = JSON.stringify(data);
    return this.http
    .post(API_URL + '/api/reports/time', body,
    {headers: new HttpHeaders().set('Content-Type','application/json')})
    .map(response => {
      //this.user_id = response;
      return response
    }) .catch(this.handleError);
  }

  //get current week
  public getWeek(): Observable<Response> {
    //let params = new HttpParams().set("week",week);
    return this.http
    .get(API_URL + '/api/checkrotation/')
    .map(response => {
      return response
    })
    .catch(this.handleError);
  }

    //get rotation by week
    public getRotation(week): Observable<Response> {
      let params = new HttpParams().set("week",week);
      return this.http
      .get(API_URL + '/api/rotation/', {params:params})
      .map(response => {
        return response
      })
      .catch(this.handleError);
    }

  //Get week with status active
  public getWeekByStatus(): Observable<Response> {
    //let params = new HttpParams().set("id",id);
    return this.http
    .get(API_URL + '/api/checkrotation/')
    .map(response => {
      return response
    })
    .catch(this.handleError);
  }


  //update date on week
  public updateDayOnWeek(day, week): Observable<Response> {
    let body = JSON.stringify({"day":day, "week":week});
    return this.http
    .put(API_URL + '/api/updateday/', body,
    {headers: new HttpHeaders().set('Content-Type','application/json')})
    .map(response => {
      return response
    })
    .catch(this.handleError);
  }

  //update rotation
  public updateRotation(data): Observable<Response> {
    data.sessionId = this.cookie;
    let body = JSON.stringify(data);
    return this.http
    .put(API_URL + '/api/rotation/', body,
    {headers: new HttpHeaders().set('Content-Type','application/json')})
    .map(response => {
      return response
    })
    .catch(this.handleError);
  }

  public login(data): Observable<Response> {
    console.log(API_URL);
    let body = JSON.stringify(data);
    return this.http
    .post(API_URL + '/api/login', body,
    {headers: new HttpHeaders().set('Content-Type','application/json')})
    .map(response => {
      return response
    })
    .catch(this.handleError);
  }

  public logout(): Observable<Response> {
    let data =  this.cookieService.get("SessionId");
    let body = JSON.stringify({"SessionId": data})
    return this.http
    .post(API_URL + '/api/logout', body,
    {headers: new HttpHeaders().set('Content-Type','application/json')})
    .map(response => {
      return response
    })
    .catch(this.handleError);
  }

  //send the time off to add it
  public addTimeOff(data): Observable<Response> {
    let body = JSON.stringify(data)
    return this.http
    .post(API_URL + '/api/timeoff', body,
    {headers: new HttpHeaders().set('Content-Type','application/json')})
    .map(response => {
      return response
    })
    .catch(this.handleError);
  }

  //update time off
  public updateTimeOff(data): Observable<Response> {
    let body = JSON.stringify(data)
    return this.http
    .put(API_URL + '/api/timeoff', body,
    {headers: new HttpHeaders().set('Content-Type','application/json')})
    .map(response => {
      return response
    })
    .catch(this.handleError);
  }

  public deleteTimeOff(data): Observable<Response> {
    let params = new HttpParams();
    params = params.append("_id",data._id);
    params = params.append("reasonMD",data.time_off_reasonMD);
    params = params.append("sessionId",this.cookie);
    return this.http
    .delete(API_URL + '/api/timeoff', {params:params})
    .map(response => {
      return response
    })
    .catch(this.handleError);
  }

    //Get time off for specific user
    public getTimes(id): Observable<Response> {
      let params = new HttpParams();
      params = params.append("user_id",id);
      params = params.append("sessionId",this.cookie);
      return this.http
      .get(API_URL + '/api/timeoffs/',{ params: params })
      .map(response => {
        return response
      })
      .catch(this.handleError);
    }

    //pass to next month with case average
    public case_average_next_month(id): Observable<Response> {
      let params = new HttpParams();
      params = params.append("_id",id);
      return this.http
      .get(API_URL + '/api/caseaverage/',{ params: params })
      .map(response => {
        return response
      })
      .catch(this.handleError);
    }

    //add case average when time off start
    public case_average_add(data): Observable<Response> {
      let body = JSON.stringify(data)
      return this.http
      .post(API_URL + '/api/caseaverage', body,
      {headers: new HttpHeaders().set('Content-Type','application/json')})
      .map(response => {
        return response
      })
      .catch(this.handleError);
    }

  //update time off
    public case_average_endTimeoff(data): Observable<Response> {
      let body = JSON.stringify(data)
      return this.http
      .put(API_URL + '/api/caseaverage', body,
      {headers: new HttpHeaders().set('Content-Type','application/json')})
      .map(response => {
        return response
      })
      .catch(this.handleError);
    }

  // Weekend Rotation API Calls
  // Get all Weekend Rotation dates
  public getWeekendRotations() {
    return this.http
      .get(API_URL +'/api/weekendRotations')
      .map(response => {
        let data = [];
        for (let user of response['body']){
          for (let obj of user.weekendRotationDates){
            data.push({
              title: user.name,
              start: new Date(obj.date),
              id: user._id,
              actions: this.actions
            });
          }
        }
        return data;
      })
      .catch(this.handleError);
  }

  private handleError (error: Response | any) {
    console.error('ApiService::handleError', error);
    return Observable.throw(error);
  }

}
