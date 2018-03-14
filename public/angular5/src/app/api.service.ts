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
    let params = new HttpParams().set("sessionid",this.cookie);
    return this.http
    .get(API_URL + '/api/check/', { params: params })
    .map(response => {
      console.log("response from check navbar", response)
      //this.user_id = response;
      return response
    })
    .catch(this.handleError);
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
  
  public getSchedule(id): Observable<Response> {
    let params = new HttpParams().set("id",id);    
    return this.http
    .get(API_URL + '/api/schedule/', { params: params })
    .map(response => {
      return response
    })
    .catch(this.handleError);
  }

  public async addTickets(engi_id){
    let user;
    let user_id;
    user = await this.getUserBySessionId().toPromise();
    user_id = user.body;
    let body = JSON.stringify({"engi_id": engi_id, "user_id": user_id._id});
    console.log("Send user to ticket ", user_id);

     await this.http
    .post(API_URL + '/api/ticket', body,
    {headers: new HttpHeaders().set('Content-Type','application/json')})
    .map(response => {
      return response
    })
    .catch(this.handleError);
  

    return;
  }

  public deleteTickets(id): Observable<Response> {
    let body = JSON.stringify({"engi_id": id})
    return this.http
    .put(API_URL + '/api/ticket', body,
     {headers: new HttpHeaders().set('Content-Type','application/json')}) //{headers: new HttpHeaders().set('Content-Type','application/json')}
    .map(response => {
      return response
    })
    .catch(this.handleError);
  }
  

  public addUser(data): Observable<Response> {
    let body = JSON.stringify(data)
    return this.http
    .post(API_URL + '/api/login/register', body,
    {headers: new HttpHeaders().set('Content-Type','application/json')})
    .map(response => {
      return response
    })
    .catch(this.handleError);
  }

  public updateUser(data): Observable<Response> {
    let body = JSON.stringify(data)
    return this.http
    .put(API_URL + '/api/user', body,
    {headers: new HttpHeaders().set('Content-Type','application/json')})
    .map(response => {
      return response
    })
    .catch(this.handleError);
  }

  public addSchedule(data): Observable<Response> {
    let body = JSON.stringify(data)
    return this.http
    .post(API_URL + '/api/schedule', body,
    {headers: new HttpHeaders().set('Content-Type','application/json')})
    .map(response => {
      return response
    })
    .catch(this.handleError);
  }
  public updateSchedule(data): Observable<Response> {
    let body = JSON.stringify(data)
    return this.http
    .put(API_URL + '/api/schedule', body,
    {headers: new HttpHeaders().set('Content-Type','application/json')})
    .map(response => {
      return response
    })
    .catch(this.handleError);
  }

  public login(data): Observable<Response> {
    let body = JSON.stringify(data)
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

  private handleError (error: Response | any) {
    console.error('ApiService::handleError', error);
    return Observable.throw(error);
  }

}