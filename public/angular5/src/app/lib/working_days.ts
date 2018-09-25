export class working_days
{

    constructor(){

    }

    
    checkhours_oneday(dayon_hour, dayoff_hour):number{
      let hour = dayon_hour - dayoff_hour
      if (hour < 8){
        return 1;
      }
      else{
        return 0;
      }
    }

    checkhours(hour):number{
      //console.log("day_on hour",hour)
      if (hour < 12){
        return 1;
      }
      else{
        return 0;
      }
    }

    calcBusinessDays(dDate1, dDate2):number {         // input given as Date objects
 
        var iWeeks, iDateDiff, iAdjust = 0;
       
        if (dDate2 < dDate1) return -1;                 // error code if dates transposed
       
        var iWeekday1 = dDate1.getDay();                // day of week
        var iWeekday2 = dDate2.getDay();
       
        iWeekday1 = (iWeekday1 == 0) ? 7 : iWeekday1;   // change Sunday from 0 to 7
        iWeekday2 = (iWeekday2 == 0) ? 7 : iWeekday2;
       
        if ((iWeekday1 > 5) && (iWeekday2 > 5)) iAdjust = 1;  // adjustment if both days on weekend
       
        iWeekday1 = (iWeekday1 > 5) ? 5 : iWeekday1;    // only count weekdays
        iWeekday2 = (iWeekday2 > 5) ? 5 : iWeekday2;
       
        // calculate differnece in weeks (1000mS * 60sec * 60min * 24hrs * 7 days = 604800000)
        iWeeks = Math.floor((dDate2.getTime() - dDate1.getTime()) / 604800000)
       
        if (iWeekday1 <= iWeekday2) {
          iDateDiff = (iWeeks * 5) + (iWeekday2 - iWeekday1)
        } else {
          iDateDiff = ((iWeeks + 1) * 5) - (iWeekday1 - iWeekday2)
        }
       
        iDateDiff -= iAdjust                            // take into account both days on weekend
       
        return (iDateDiff + 1);                         // add 1 because dates are inclusive
       
      }

      checkDays(day_on, day_off, countdays):number{
        let hour:number;
        if(countdays === 1){
          hour = this.checkhours_oneday(day_on.hour,day_off.hour);
        }
        else{
          hour = this.checkhours(day_on.hour);
        }
        return hour;
      }

    days_between(day_off, day_on):number{
        let date1 = new Date(day_off.year,(day_off.month-1),day_off.day);
        let date2 = new Date(day_on.year,(day_on.month-1),day_on.day);
        let result = this.calcBusinessDays(date1,date2);
        //console.log("calcBusinessDays", result);
        let less = this.checkDays(day_on, day_off,result);
        //console.log("less", less);
        result = result - less;
        return result;
    }


    working_days(timeoff):object{
      let day_off = timeoff.day_off, day_on = timeoff.day_on;
      let working_days = {"current":0,"next":0};
      let days = this.days_between(day_off, day_on);
      if(day_on.month != day_off.month)
      {
        working_days.next = days - day_on.day;
        working_days.current = days - working_days.next;
      }
      else{
        working_days.current = days;
      }
      //console.log("working_days",working_days);
      return working_days;
    }

}