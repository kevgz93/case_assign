export class TwentyFourFormat
{

    constructor(){

    }

    checkHour(hour):number{
        let result:number;
        if( hour < 0){
            hour =- hour;
            result = 24 - hour;
        }
        else{
            result = hour;
        }
        return result;
    }

}