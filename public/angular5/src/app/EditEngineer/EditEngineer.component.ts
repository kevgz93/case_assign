import { Component, OnInit } from '@angular/core';
import {ApiService} from '../api.service';
import { Observable } from 'rxjs/Observable';
import { NgModel } from '@angular/forms';
import {FormBuilder, FormGroup, Validators, FormControl, ReactiveFormsModule} from '@angular/forms';
import {Router} from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
interface engineer{
	name : String,
	last_name : String,
	username: String,
	password: String,
	email: String,
	city : String,
	time_zone: Number,
	sta_dyn: Number,
	max_case: Number,
	status: Boolean,
	activeSession: String,
	role: String,
	days_working: Number,
	last_case: String
};

@Component({
	selector: 'app-engineer',
	templateUrl: './EditEngineer.component.html',
	styleUrls: ['./EditEngineer.component.scss']
})



export class EngineerComponent implements OnInit {

	public id;
	public user;
	private showhtml;
	private current_user_role;
	rForm: FormGroup;
	myform: FormGroup;



	constructor(private service: ApiService, private fb: FormBuilder, private router:Router, private cookieService: CookieService) {

	}


	getOneSchedule(): Observable<engineer>{
		this.service.getOneEngineer(this.id)
		.subscribe(user => {
			console.log(user);
			if(user.status != 200){
				alert("error finding user");
			}
			else{
				this.user = user;
				this.fillForm();
				this.showhtml = true;
			}
		})

		return;
	}

	updateUser(data){
		console.log("Info del form: ", data);
		data._id = this.id;
		data.max = +data.max;

		switch(data.sta_dyn){
			case "Both":
			data.sta_dyn = 3;
			break;
			case "Dynamic":
			data.sta_dyn = 2;
			break;
			case "Static":
			data.sta_dyn = 1;
			break;
		}
		data.status = data.status == "Available" ? true : false;
		data.role = data.role.toLowerCase();  // Changes Admin -> admin or User -> user
		console.log(data.role);
		this.service.updateUser(data)
		.subscribe(response => {
			console.log(response.status);
			if(response.status != 204){
				alert("error finding user");
			}
			else{
				alert("User updated");
				this.router.navigate(['./home'])
			}
		})

		return;
	}

	fillForm(){

		var sta_dyn_tmp = "";
		switch(this.user.body.sta_dyn){
			case 1:
			sta_dyn_tmp = "Static";
			break;
			case 2:
			sta_dyn_tmp = "Dynamic";
			break;
			case 3:
			sta_dyn_tmp = "Both";
			break;
		}


		this.myform= this.fb.group({
			name: this.user.body.name,
			last_name: this.user.body.last_name,
			email: this.user.body.email,
			city : this.user.body.city,
			sta_dyn: sta_dyn_tmp,
			max: this.user.body.max_case,
			status: this.user.body.status ? "Available" : "Disable",
			role: this.user.body.role == "admin" ? "Admin" : "User",
			username: this.user.body.username,
			password: this.user.body.password,
		});
	}

	getUserRole(){
		let cookie = this.cookieService.get('SessionId');
		if(!cookie){
		    this.router.navigate(['./home'])
		}
		else{
			this.service.getUserBySessionId().subscribe(response =>{
				if(response.status != 201) {
				    this.router.navigate(['./home'])
				}
				else{
					this.current_user_role = response.body;
				}
			});
		}
	}

	ngOnInit() {
		this.showhtml = false;
		this.service.currentId.subscribe(message => this.id = message);
		this.getUserRole();
		this.getOneSchedule();
	}

}
