
import {ConvertTimeZero} from './../lib/time_zero';
import {TimeOff} from './../lib/time_off';

const date = new Date();
const convertTimeZone = new ConvertTimeZero();
const timeOff = new TimeOff();

export class IsAvailable
{

    constructor(){

    }
    
    checkMinutes(minutes):string{
        if (minutes != 0){
            return `${minutes}`;
        }
        return `${minutes}0`;
    }

    //Check the shift and unable if is out
    endDay(morning, afternoon, difference):boolean{     
        let aft_hour = afternoon.hour - difference;
        let morn_hour = morning.hour - difference;
        let date = new Date;
        if (morn_hour > date.getHours()){
            return false;
        }
        else if (morn_hour >= date.getHours() && date.getMinutes() < morning.minutes){
            return false;
        }
        else if (morn_hour <= date.getHours() && aft_hour > date.getHours()){
            return true;
        }
        else if (morn_hour <= date.getHours() && aft_hour === date.getHours() && afternoon.minutes > date.getMinutes()){
            return true;
        }
        else if (date.getDay() === 6 || date.getDay() === 0){
            return true;
        }
        return false;
        }

    colorHour(afternoon, difference):string{
        let date = new Date();
        let aft_hour = afternoon.hour - difference;
        let aft_minutes = afternoon.minutes;
        let hour = aft_hour - date.getHours();// 1
        
        let minutes = date.getMinutes() - aft_minutes; //30
        if(minutes < 0){
            minutes = -(minutes);
        }
        
        if (hour === 1 && minutes < 30){
            return "warning";
        }

        else if (hour === 0 && minutes > 30){
            return "warning";
        }

        else if (hour === 1 && minutes >= 30){
            return "danger";
        }

        else if (hour === 0 && date.getMinutes() <= aft_minutes){
            return "danger";
        }
        return "";
        }



    filterScheduleTodayDay(engineer){
        engineer.time_off = convertTimeZone.convertFromTimeOffLocally(engineer.time_off);
        let schedule = engineer.schedule_loaded[0];
        let today = {morning:0, time:"", available:true, color:"white", timeoff: false,average:{}};
        let hour = {morning:0, afternoon:0};
        let minutes= {morning:0, afternoon:0};
        let morning_minutes;
        let afternoon_minutes;
        let available:boolean;
        let timeoff:any;
        let color;
        let difference = date.getTimezoneOffset() / 60; // this difference is because the times are saved on the DB as gmt+0
        if (date.getDay()===1){
            timeoff = timeOff.timeOff(engineer.time_off, engineer.working_days);
            available = this.endDay(schedule.monday_morning, schedule.monday_afternoon, difference);
            color = this.colorHour(schedule.monday_afternoon, difference);
            hour.morning = schedule.monday_morning.hour - difference;
            minutes.morning = schedule.monday_morning.minutes;
            hour.afternoon = schedule.monday_afternoon.hour - difference;
            minutes.afternoon = schedule.monday_afternoon.minutes;
        
            morning_minutes = this.checkMinutes(minutes.morning);
            afternoon_minutes = this.checkMinutes(minutes.afternoon);
            today.morning = hour.morning = schedule.monday_morning.hour - difference;
            today.time= `${hour.morning}:${morning_minutes} - ${hour.afternoon}:${afternoon_minutes}`;
            today.available = available;//cambiarlo a available
            today.color = color;
            today.timeoff = timeoff;
            return today;
        }
        else if (date.getDay()===2){
            timeoff = timeOff.timeOff(engineer.time_off, engineer.working_days);
            available = this.endDay(schedule.tuesday_morning, schedule.tuesday_afternoon, difference);
            color = this.colorHour(schedule.tuesday_afternoon, difference);
            hour.morning = schedule.tuesday_morning.hour - difference;
            minutes.morning = schedule.tuesday_morning.minutes;
            hour.afternoon = schedule.tuesday_afternoon.hour - difference;
            minutes.afternoon = schedule.tuesday_afternoon.minutes;
        
            morning_minutes = this.checkMinutes(minutes.morning);
            afternoon_minutes = this.checkMinutes(minutes.afternoon);
            today.morning = hour.morning = schedule.tuesday_morning.hour - difference;
            today.time= `${hour.morning}:${morning_minutes} - ${hour.afternoon}:${afternoon_minutes}`;
            today.available = available;
            today.color = color;
            today.timeoff = timeoff;

            return today;
        }
        else if (date.getDay()===3){
            timeoff = timeOff.timeOff(engineer.time_off, engineer.working_days);
            available = this.endDay(schedule.wednesday_morning, schedule.wednesday_afternoon, difference);
            color = this.colorHour(schedule.wednesday_afternoon, difference);
            hour.morning = schedule.wednesday_morning.hour - difference;
            minutes.morning = schedule.wednesday_morning.minutes;
            hour.afternoon = schedule.wednesday_afternoon.hour - difference;
            minutes.afternoon = schedule.wednesday_afternoon.minutes;
            morning_minutes = this.checkMinutes(minutes.morning);
        
            afternoon_minutes = this.checkMinutes(minutes.afternoon);
            today.morning = hour.morning = schedule.wednesday_morning.hour - difference;
            today.time= `${hour.morning}:${morning_minutes} - ${hour.afternoon}:${afternoon_minutes}`;
            today.available = available;
            today.color = color;
            today.timeoff = timeoff;

            return today;
        }
        else if (date.getDay()===4){
            timeoff = timeOff.timeOff(engineer.time_off, engineer.working_days);
            available = this.endDay(schedule.thursday_morning, schedule.thursday_afternoon, difference);
            color = this.colorHour(schedule.thursday_afternoon, difference);
            hour.morning = schedule.thursday_morning.hour - difference;
            minutes.morning = schedule.thursday_morning.minutes;
            hour.afternoon = schedule.thursday_afternoon.hour - difference;
            minutes.afternoon = schedule.thursday_afternoon.minutes;
        
            morning_minutes = this.checkMinutes(minutes.morning);
            afternoon_minutes = this.checkMinutes(minutes.afternoon);
            today.morning = hour.morning = schedule.thursday_morning.hour - difference;
            today.time= `${hour.morning}:${morning_minutes} - ${hour.afternoon}:${afternoon_minutes}`;
            today.available = available;
            today.color = color;
            today.timeoff = timeoff;

            return today;
        }
        else if (date.getDay()===5){
            timeoff = timeOff.timeOff(engineer.time_off, engineer.working_days);
            available = this.endDay(schedule.friday_morning,schedule.friday_afternoon, difference);
            color = this.colorHour(schedule.friday_afternoon, difference);
            hour.morning = schedule.friday_morning.hour - difference;
            minutes.morning = schedule.friday_morning.minutes;
            hour.afternoon = schedule.friday_afternoon.hour - difference;
            minutes.afternoon = schedule.friday_afternoon.minutes;
        
            morning_minutes = this.checkMinutes(minutes.morning);
            afternoon_minutes = this.checkMinutes(minutes.afternoon);
            today.morning = hour.morning = schedule.friday_morning.hour - difference;
            today.time= `${hour.morning}:${morning_minutes} - ${hour.afternoon}:${afternoon_minutes}`;
            today.available = available;
            today.color = color;
            today.timeoff = timeoff;

            return today;
        }
        else if (date.getDay()===6 || date.getDay()===1){
            timeoff = timeOff.timeOff(engineer.time_off, engineer.working_days);
            available = this.endDay(schedule.friday_morning, schedule.friday_afternoon, difference);
            color = this.colorHour(schedule.friday_afternoon, difference);
            hour.morning = schedule.friday_morning.hour - difference;
            minutes.morning = schedule.friday_morning.minutes;
            hour.afternoon = schedule.friday_afternoon.hour - difference;
            minutes.afternoon = schedule.friday_afternoon.minutes;
        
            morning_minutes = this.checkMinutes(minutes.morning);
            afternoon_minutes = this.checkMinutes(minutes.afternoon);
            today.morning = hour.morning = schedule.friday_morning.hour - difference;
            today.time= `${hour.morning}:${morning_minutes} - ${hour.afternoon}:${afternoon_minutes}`;          
            today.available = available;
            today.color = color;
            today.timeoff = timeoff;

            return today;
        }
    // modificar aca y crear un nuevo metodo para el agregar los colores
    }
}