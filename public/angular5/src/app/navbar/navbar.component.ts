import { Component, OnInit } from '@angular/core';
import {ApiService} from '../api.service';
import { Observable } from 'rxjs/Observable';
import {Router} from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  public user;
  private showMaintenance = false;
  public shownav:boolean = false;
  private cookie;

  constructor(private service: ApiService, private router:Router, private cookieService: CookieService) { }

  getMonday(d) {
    d = new Date(d);
    var day = d.getDay(),
        diff = d.getDate() - day + (day == 0 ? -6:1); // adjust when day is sunday
    return new Date(d.setDate(diff));
  }

  checkQM():Observable<Response>{
    let date = new Date();
    let day = date.getDate();
    let monday = this.getMonday(new Date());
    let week;
    this.service.getWeekByStatus().subscribe(data =>{
    week = data.body;
    if(week.active.status === true && week.active.day != monday.getDate()){
      this.changeDayWeek(monday.getDate(), week.week)
    }
    })
    return
  }

  changeDayWeek(day, week):Observable<Boolean>{
    this.service.updateDayOnWeek(day, week).subscribe(response => {
      console.log(response);
    })
    return
  }

  checkAdmin(){
    if (this.user.role === 'admin'){
      this.showMaintenance = true;
    }
  }

  checkSessionId(login){
    let cookie = this.cookieService.get('SessionId');
    let url = "login";
    if(!cookie){
      this.shownav = false;
      this.redirect(url);
    }
    else{
      this.service.getUserBySessionId().subscribe(response =>{
        console.log("when check session on navbar",response);
        if(response.status != 201) {
          this.shownav = false;
          this.redirect(url);
        }
        else{
          this.user = response.body;
          this.shownav = true;
          this.checkAdmin();
        }
        
        
      });
    }
  }

  redirect(url){
    if(url === 'login')
    this.router.navigate(['/'+url]);
    else if(url === 'home'){
      
      this.router.navigate([url]);
    }
    return
  }

  goHome(){
    this.router.navigate(['./home'])
    return
  }

  goReport(){
    this.router.navigate(['./report'])
    return
  }

  goAddUser(){
    this.router.navigate(['./login/register'])
    return
  }

  goEditEngineer(){
    this.user._id;
    this.service.changeUserId(this.user._id);
    this.router.navigate(['./editengineer'])
    return
  }
  goEditUsers(){
    // this.user._id;
    // this.service.changeUserId(this.user._id);
    this.router.navigate(['./editusers'])
    return
  }

  goShowSchedule(){
    this.user._id;
    this.service.changeUserId(this.user._id);
    this.router.navigate(['./showschedule'])
    return
  }

  goLogout(){
    this.router.navigate(['./logout'])
    return
  }

  goGetRotation(){
    this.router.navigate(['./rotation'])
    return
  }
  
  goEditRotation(){
    this.router.navigate(['./editrotation'])
    return
  }

  ngOnInit() {
    let login;
    this.service.currentId.subscribe(message => login = message);
    //this.shownav = true;
    this.checkQM();
    this.checkSessionId(login);
    
    
  }
}


