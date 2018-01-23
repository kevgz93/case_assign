import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';


const API_URL = environment.apiUrl;

interface engineer{

}

@Injectable()
export class ApiService {


  constructor(
    private http: HttpClient
  ) {
  }

  // API: GET /todos
  public getAllEngineers(): Observable<Response> {
    return this.http
<<<<<<< HEAD
    .get(API_URL + '/api/user')
=======
    .get(API_URL + '/api/engineers')
>>>>>>> 5991c7e41631c0eeebe613da644eb47bb119f3d4
    .map(response => {
      return response
    })
    .catch(this.handleError);
  }


  // API: GET one engineer
  public getOneEngineers(id): Observable<Response> {
    let body = JSON.stringify({"id_engi": id})    
    return this.http
<<<<<<< HEAD
    .post(API_URL + '/api/user', body, 
=======
    .post(API_URL + '/api/engineers', body, 
>>>>>>> 5991c7e41631c0eeebe613da644eb47bb119f3d4
    {headers: new HttpHeaders().set('Content-Type','application/json')}
  )
    .map(response => {
      return response
    })
    .catch(this.handleError);
  }

  public addTickets(id): Observable<Response> {
    let body = JSON.stringify({"id_engi": id})
    return this.http
    .post(API_URL + '/api/ticket', body,
    {headers: new HttpHeaders().set('Content-Type','application/json')})
    .map(response => {
      return response
    })
    .catch(this.handleError);
  }

  public deleteTickets(id): Observable<Response> {
    let body = JSON.stringify({"id_engi": id})
    return this.http
    .put(API_URL + '/api/ticket', body,
     {headers: new HttpHeaders().set('Content-Type','application/json')}) //{headers: new HttpHeaders().set('Content-Type','application/json')}
    .map(response => {
      return response
    })
    .catch(this.handleError);
  }
  
<<<<<<< HEAD
  public addUser(data): Observable<Response> {
    let body = JSON.stringify(data)
    return this.http
    .post(API_URL + '/api/login/register', body,
=======
  public addEngineer(data): Observable<Response> {
    let body = JSON.stringify(data)
    return this.http
    .post(API_URL + '/api/engineer', body,
>>>>>>> 5991c7e41631c0eeebe613da644eb47bb119f3d4
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

  private handleError (error: Response | any) {
    console.error('ApiService::handleError', error);
    return Observable.throw(error);
  }
/*
  // API: POST /todos
  public createTodo(todo: Todo) {
    // will use this.http.post()
  }

  // API: GET /todos/:id
  public getTodoById(todoId: number) {
    // will use this.http.get()
  }

  // API: PUT /todos/:id
  public updateTodo(todo: Todo) {
    // will use this.http.put()
  }

  // DELETE /todos/:id
  public deleteTodoById(todoId: number) {
    // will use this.http.delete()
  }
*/
}