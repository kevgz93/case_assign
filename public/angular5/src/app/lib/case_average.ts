export class case_average
{

    constructor(){

    }

    days_between(day_off, day_on):number{
        let date1 = new Date(day_off.year,(day_off.month-1),day_off.day);
        let date2 = new Date(day_on.year,(day_on.month-1),day_on.day);
        let timeDiff = Math.abs(date2.getTime() - date1.getTime());
        let result = Math.ceil(timeDiff / (1000*3600*24)) + 1 ;
        return result;
    }


    check_timeoff():void{

    }

}