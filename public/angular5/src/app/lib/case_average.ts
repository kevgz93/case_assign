import {ApiService} from '../api.service';
import { Observable } from 'rxjs/Observable';

export class case_average
{
    
    constructor(private service: ApiService){

    }

    number_max_repeat(difference):number{
        let max = {"count":0,"value":0};


        difference.forEach(number => {
            
            if(number.count > max.count){
                max.count = number.count;
                max.value = number.value;
            }
            
        });

        return max.value;
    }

    repeatNumber(original) {
 
        var compressed = [];
        // make a copy of the input array
        var copy = original.slice(0);
     
        // first loop goes over every element
        for (var i = 0; i < original.length; i++) {
     
            var myCount = 0;	
            // loop over every element in the copy and see if it's the same
            for (var w = 0; w < copy.length; w++) {
                if (original[i] == copy[w]) {
                    // increase amount of times duplicate is found
                    myCount++;
                    // sets item to undefined
                    delete copy[w];
                }
            }
     
            if (myCount > 0) {
                var a = {"value":0,"count":0};
                a.value = original[i];
                a.count = myCount;
                compressed.push(a);
            }
        }
     
        return compressed;
    };
    

    positiveNumber(difference){
        if (difference < 0)
        {
            return -(difference);
        }

        return difference;
    }

    get_difference(users, media):number{
        let dif_media:number = 0;
        let sum:number = 0;
        let dif = [];
        let difference = {};
        let result;
        users.forEach(user => {

            if(user.max_case != 1){
                let difference = media - user.countmonth;
                difference = this.positiveNumber(difference);
                dif.push(difference);
            }

        });

        //media of difference
        dif.forEach(number => {
            sum = sum + number;
        })
        
        dif_media = sum / dif.length;

        result = Math.floor(dif_media);
    
        //count every time the number repeat   
        //difference = this.repeatNumber(dif);
        //result = this.number_max_repeat(difference);
        

        return result;
    }

    get_cases_by_month():Promise <any>{
        let promise = new Promise((resolve, reject) =>{
            let date = new Date();
            let cases:number;
            let month = date.getMonth() + 1;
            //let result;
            this.service.monthlycases().subscribe(res =>{
                cases = Object.keys(res.body).length;
                resolve(cases);
            })
            
        })
 //brings all the cases on the current month, uses report function for that
        
        
        return promise;
    }

    getAverage(users, media, difference):Object{
        let dif;
        let average = {"average":0, "color":""};
        users.forEach(user => {
            dif = media - user.countmonth;

            if(dif <0){
            dif = -(dif);
            }

            if(user.working_days.dayoff != 0 && difference != 0){
                user.average = user.countmonth + (difference * user.working_days.dayoff);
            }
            else if(user.working_days.dayoff != 0 && dif > 4){
                user.average = user.countmonth;
            }
            else if(user.working_days.dayoff != 0 && difference === 0){
                user.average = user.countmonth + user.working_days.dayoff;
            }
            else {
                user.average = user.countmonth - difference;
            }

        });
        
        return users;
    }

    getColor(users, media){
        users.forEach(user => {
            if(user.average > media){
                user.average_color =  "red";
            }
            user.average_color =  "green";

        });
        return users
     }


    //Main Function
    average(users):Promise<Object>{

        let promise = new Promise((resolve, reject) =>{
            let total_cases;
            let total_users = Object.keys(users).length;
            let media,difference;
            this.get_cases_by_month().then(result =>{
                total_cases =  result;
                media = Math.floor(Math.round(+(total_cases / total_users).toFixed(2)));
                difference = this.get_difference(users, media);
                users = this.getAverage(users, media, difference);
                users = this.getColor(users, media);
                resolve(users);
            });

        } )

        return promise;
    }
}