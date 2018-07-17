export class TwentyFourFormat
{

    constructor(){

    }

    checkHour(hour):number{
        let result:number;
        if( hour < 0){
            console.log("numero negativo", hour);
            hour =- hour;
            console.log("numero positivo", hour);
            result = 24 - hour;
        }
        else{
            result = hour;
        }
        return result;
    }

}