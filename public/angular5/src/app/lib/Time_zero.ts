export class ConvertTimeZero
{

    constructor(){

    }

    isDayLight(){
    let moment = require('moment-timezone');
    let date = new Date();
    let NYDate = moment.tz(date, "America/New_York");
    let offset:number = NYDate._offset;
    return offset;
    }

    getLocalDifference():any
    {
        let difference = {"hour":0,"minutes":0};
        let date = new Date();
        let offset = date.getTimezoneOffset();
        if(offset != 330){
            difference.hour = offset / 60;
        }
        else{
            difference.hour = 5;
            difference.minutes = 30;
        }
        return difference;
    }

    getDifference(timezone)
    {
        let offset = this.isDayLight();
        let dayL;
        let dLight;
        let difference = { "hour": 0, "minutes": 0 };
        if(offset != -300){
            dayL = true;
          }
      
          if(dayL){
            dLight = 1;
          }
      
          if (timezone === "cat") {
            difference.hour = 6;
          }
          else if (timezone === "pt") {
            difference.hour = 7 + dLight;
          }
          else if (timezone === "ct") {
            difference.hour = 5 + dLight;
          }
          else if (timezone === "et") {
            difference.hour  = 4 + dLight;
          }
          else if (timezone === "uk") {
            difference.hour  = 0 + dLight;
          }
          else if (timezone === "cet") {
            difference.hour  = -1 + dLight;
          }
          else if (timezone === "ist") {
            difference.hour  = -5;
            difference.minutes = 30;
          }
          else if (timezone === "ict") {
            difference.hour  = -7;
          }
          else if (timezone === "sgt") {
            difference.hour  = -8;
          }
          else if (timezone === "jst") {
            difference.hour  = -9;
          }
          return difference;
    }

    convertFromTimeZero(schedule):object{
        let difference;
        let aux = schedule;
        difference = this.getDifference(schedule.time_zone);
        schedule.monday_morning.hour = aux.monday_morning.hour - difference.hour;
        schedule.monday_morning.minutes = aux.monday_morning.minutes;
        schedule.monday_afternoon.hour = aux.monday_afternoon.hour - difference.hour;
        schedule.monday_afternoon.minutes = aux.monday_afternoon.minutes;
        schedule.tuesday_morning.hour = aux.tuesday_morning.hour - difference.hour;
        schedule.tuesday_morning.minutes = aux.tuesday_morning.minutes;
        schedule.tuesday_afternoon.hour = aux.tuesday_afternoon.hour - difference.hour;
        schedule.tuesday_afternoon.minutes = aux.tuesday_afternoon.minutes;
        schedule.wednesday_morning.hour = aux.wednesday_morning.hour - difference.hour;
        schedule.wednesday_morning.minutes = aux.wednesday_morning.minutes;
        schedule.wednesday_afternoon.hour = aux.wednesday_afternoon.hour - difference.hour;
        schedule.wednesday_afternoon.minutes = aux.wednesday_afternoon.minutes;
        schedule.thursday_morning.hour = aux.thursday_morning.hour - difference.hour;
        schedule.thursday_morning.minutes = aux.thursday_morning.minutes;
        schedule.thursday_afternoon.hour = aux.thursday_afternoon.hour - difference.hour;
        schedule.thursday_afternoon.minutes = aux.thursday_afternoon.minutes;
        schedule.friday_morning.hour = aux.friday_morning.hour - difference.hour;
        schedule.friday_morning.minutes = aux.friday_morning.minutes;
        schedule.friday_afternoon.hour = aux.friday_afternoon.hour - difference.hour;
        schedule.friday_afternoon.minutes = aux.friday_afternoon.minutes;
        return schedule;
    }

    convertFromTimeZeroLocally(schedule):object
    {
        
        let date = new Date;
        let difference = date.getTimezoneOffset() / 60;
        schedule.monday_morning.hour = schedule.monday_morning.hour - difference;
        schedule.monday_morning.minutes = schedule.monday_morning.minutes;
        schedule.monday_afternoon.hour = schedule.monday_afternoon.hour - difference;
        schedule.monday_afternoon.minutes = schedule.monday_afternoon.minutes;
        schedule.tuesday_morning.hour = schedule.tuesday_morning.hour - difference;
        schedule.tuesday_morning.minutes = schedule.tuesday_morning.minutes;
        schedule.tuesday_afternoon.hour = schedule.tuesday_afternoon.hour - difference;
        schedule.tuesday_afternoon.minutes = schedule.tuesday_afternoon.minutes;
        schedule.wednesday_morning.hour = schedule.wednesday_morning.hour - difference;
        schedule.wednesday_morning.minutes = schedule.wednesday_morning.minutes;
        schedule.wednesday_afternoon.hour = schedule.wednesday_afternoon.hour - difference;
        schedule.wednesday_afternoon.minutes = schedule.wednesday_afternoon.minutes;
        schedule.thursday_morning.hour = schedule.thursday_morning.hour - difference;
        schedule.thursday_morning.minutes = schedule.thursday_morning.minutes;
        schedule.thursday_afternoon.hour = schedule.thursday_afternoon.hour - difference;
        schedule.thursday_afternoon.minutes = schedule.thursday_afternoon.minutes;
        schedule.friday_morning.hour = schedule.friday_morning.hour - difference;
        schedule.friday_morning.minutes = schedule.friday_morning.minutes;
        schedule.friday_afternoon.hour = schedule.friday_afternoon.hour - difference;
        schedule.friday_afternoon.minutes = schedule.friday_afternoon.minutes;
        return schedule;
    }

    convertFromTimeOffLocally(timeoff):object
    {
        console.log("timeoff",timeoff);
        let time = [];
        let date = new Date;
        let difference = date.getTimezoneOffset() / 60;
        timeoff.forEach(element => {
            element.day_off.hour = element.day_off.hour - difference;
            element.day_on.hour = element.day_on.hour - difference;
            time.push(element);
        });


        return time;
    }

      //minutes on 00 or 30
    checkMinutes(minutes):string{
        if (minutes != 0){
        return `${minutes}`;
        }
        return `${minutes}0`;
    }

    convertTimeToString(schedule):object
    {
        let minutes;
        let schedule_total = {"monday_morning": '' , "monday_afternoon":'' ,"tuesday_morning":'' ,"tuesday_afternoon":'' ,
        "wednesday_morning":'' ,"wednesday_afternoon":'' ,"thursday_morning":'' ,"thursday_afternoon":'' ,"friday_morning":'' ,
        "friday_afternoon":'' };
        minutes = this.checkMinutes(schedule.monday_morning.minutes);
        schedule_total.monday_morning = `${schedule.monday_morning.hour}:${minutes}`;
        minutes = this.checkMinutes(schedule.monday_afternoon.minutes);
        schedule_total.monday_afternoon = `${schedule.monday_afternoon.hour}:${minutes}`;
        minutes = this.checkMinutes(schedule.tuesday_morning.minutes);
        schedule_total.tuesday_morning = `${schedule.tuesday_morning.hour}:${minutes}`;
        minutes = this.checkMinutes(schedule.tuesday_afternoon.minutes);
        schedule_total.tuesday_afternoon = `${schedule.tuesday_afternoon.hour}:${minutes}`;
        minutes = this.checkMinutes(schedule.wednesday_morning.minutes);
        schedule_total.wednesday_morning = `${schedule.wednesday_morning.hour}:${minutes}`;
        minutes = this.checkMinutes(schedule.wednesday_afternoon.minutes);
        schedule_total.wednesday_afternoon = `${schedule.wednesday_afternoon.hour}:${minutes}`;
        minutes = this.checkMinutes(schedule.thursday_morning.minutes);
        schedule_total.thursday_morning = `${schedule.thursday_morning.hour}:${minutes}`;
        minutes = this.checkMinutes(schedule.thursday_afternoon.minutes);
        schedule_total.thursday_afternoon = `${schedule.thursday_afternoon.hour}:${minutes}`;
        minutes = this.checkMinutes(schedule.friday_morning.minutes);
        schedule_total.friday_morning = `${schedule.friday_morning.hour}:${minutes}`;
        minutes = this.checkMinutes(schedule.friday_afternoon.minutes);
        schedule_total.friday_afternoon = `${schedule.friday_afternoon.hour}:${minutes}`;

        return schedule_total;

    }

}