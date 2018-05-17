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

  //share user Id
  changeObject(message: Object) {
    console.log("aqui va el mensaje", message);
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
      console.log("response from check navbar", response)
      //this.user_id = response;
      return response
    }) .catch(this.handleError);
  }

  public getAllUsers(): Observable<Response> {
    return this.http
    .get(API_URL + '/api/getusers')
    .map(response => {
      console.log("response from check navbar", response)
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
  public deleteOneUser(id): Observable<Response> {
    let params = new HttpParams().set("_id",id);    
    return this.http
    .delete(API_URL + '/api/user/', { params: params })
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
    console.log('post....');
    return this.http.post(API_URL + '/api/ticket', body,{headers: new HttpHeaders().set('Content-Type','application/json')}).map(tickt => {
      console.log("entro a devolver el response", tickt);
      return tickt;
    }).catch(this.handleError);
  }

  public deleteTickets(id): Observable<Response> {
    let body = JSON.stringify({"engi_id": id});
    return this.http
    .put(API_URL + '/api/ticket', body,
     {headers: new HttpHeaders().set('Content-Type','application/json')}) //{headers: new HttpHeaders().set('Content-Type','application/json')}
    .map(response => {
      
      return response
    })
    .catch(this.handleError);
  }
  

  public addUser(data): Observable<Response> {
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
    let body = JSON.stringify(data);
    return this.http
    .put(API_URL + '/api/user', body,
    {headers: new HttpHeaders().set('Content-Type','application/json')})
    .map(response => {
      return response
    })
    .catch(this.handleError);
  }

  public addSchedule(data): Observable<Response> {
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
    let body = JSON.stringify(data);
    return this.http
    .put(API_URL + '/api/schedule', body,
    {headers: new HttpHeaders().set('Content-Type','application/json')})
    .map(response => {
      return response
    })
    .catch(this.handleError);
  }

  public getReport(values): Observable<Object> {
    let body = JSON.stringify(values);
    return this.http
    .post(API_URL + '/api/reports', body,
    {headers: new HttpHeaders().set('Content-Type','application/json')})
    .map(response => {
      console.log("response from check navbar", response)
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

    //get rotation table
    public getRotation(): Observable<Response> {
      //let params = new HttpParams().set("week",week);    
      return this.http
      .get(API_URL + '/api/rotations/')
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

  public login(data): Observable<Response> {
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
    console.log("cuerpo", body);
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
    console.log("cuerpo", body);
    return this.http
    .put(API_URL + '/api/timeoff', body,
    {headers: new HttpHeaders().set('Content-Type','application/json')})
    .map(response => {
      return response
    })
    .catch(this.handleError);
  }

  private handleError (error: Response | any) {
    console.error('ApiService::handleError', error);
    return Observable.throw(error);
  }

}