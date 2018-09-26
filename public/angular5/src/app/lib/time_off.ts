
export class TimeOff
{
    

    constructor(){

    }

    
    private compareDayOn = function(dayOn)
    {
        const date = new Date();
        const day_on = new Date(dayOn.year, (dayOn.month - 1), dayOn.day, dayOn.hour, dayOn.minutes);

        if(date > day_on){
            return false;
        }
        else{
            return true;
        }

    }

    private compareDayOff = function(dayOff, dayOn)
    {
        const date = new Date();
        const day_off = new Date(dayOff.year, (dayOff.month - 1), dayOff.day, dayOff.hour, dayOff.minutes);
        const day_on = new Date(dayOn.year, (dayOn.month - 1), dayOn.day, dayOn.hour, dayOn.minutes);

        if(date > day_off && date < day_on)
        {
            return true;
        }

        else{
            return false;
        }

    }
    //see if have time off
    timeOff(timeoff, working_days){
        
        let result={"status": false, "timeoff":{}};
        var status = false;
        let length = Object.keys(timeoff).length;

        if(length === 0){
            result.status = false;
        }
        if(working_days.status)
        {
               timeoff.forEach( element => {
                   if(element._id === working_days.timeoff_reference){
                    result.status = this.compareDayOn(element.day_on);
                    
                   }
               });     
        
        }
        else
        {
            timeoff.forEach(element => {
                
                status = this.compareDayOff(element.day_off, element.day_on);
                    if(status){
                        result.status = status;
                        result.timeoff = element;
                    }
                });
        }



        return result; 

    }
}