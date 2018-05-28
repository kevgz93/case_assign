import { Component, OnInit,Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {Router} from '@angular/router';
import {ApiService} from '../api.service';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {

  constructor(private service: ApiService, private router:Router, public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

    closeDialog(): void {
      this.dialogRef.close();
    }
    delete(){
      console.log(this.data.id)
      this.service.deleteOneUser(this.data.id)
      .subscribe(response =>{
        console.log("dialog", response);
        if(response.status != 204){
          alert("User not deleted")
        }
        this.dialogRef.close();
      });
      
    }

  ngOnInit() {
  }

}

