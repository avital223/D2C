import { StatisticTesting } from "../statistical.interface"
import * as statsFunction from "../statisticalConversion"

abstract class WMS4Basic extends StatisticTesting{
    norms: string = "Manual";
    usingAge: boolean = true;
    usingEducation: boolean = false;
    usingGender: boolean = false;
    limitRes : number;
    typeOfStatistics: number = 4; // using IQ testing
    getValidResult(age: number, gender: boolean, education: number, result: number[]): {} {
        let ageStr = ""
        if(age <= 17){
            ageStr = "16-17"
        } else if (age <= 19){
            ageStr = "18-19"
        } else if (age <= 24){
            ageStr = "20-24"
        } else if (age <= 29){
            ageStr = "25-29"
        } else if (age <= 34){
            ageStr = "30-34"
        } else if (age <= 44){
            ageStr = "34-44"
        } else if (age <= 54){
            ageStr = "45-54"
        } else if (age <= 64){
            ageStr = "55-64"
        } else if (age <= 69){
            ageStr = "65-69"
        } else if (age <= 74){
            ageStr = "70-74"
        } else if (age <= 79){
            ageStr = "75-79"
        } else if (age <= 84){
            ageStr = "80-84"
        } else{
            ageStr = "85-90"
        }
        let resultStr = result[0].toString()
        if ( result[0]< 0 ){
            resultStr = "0"
        } else if ( result[0] > this.limitRes){
            resultStr = this.limitRes.toString()
        }
        return [this.data[ageStr][resultStr]]
    }

    getCorrection(): {} {
       return "A"
    }
}

// tslint:disable-next-line:max-classes-per-file
export class WMS4LM1 extends WMS4Basic{
    name: string = "WMS4LM1";
    id: string = "6276882c6ce1d026cf0c6068";
    limitRes = 50;
}
// tslint:disable-next-line:max-classes-per-file
export class WMS4LM2 extends WMS4Basic{
    name: string = "WMS4LM2";
    id: string = "6276904a6ce1d026cf0c6069";
    limitRes = 50;
}

// tslint:disable-next-line:max-classes-per-file
export class WMS4LMRec extends WMS4Basic{
    name: string = "WMS4LMRec";
    id: string = "6276952c6ce1d026cf0c606a";
    typeOfStatistics=2
    limitRes = 30;
    public getPrecentageToTest (precentage:number[]){
        const precentageStr = precentage[0].toString()
        // "<2", "3-9", "10-16", "17-25", "26-50", "51-75", ">75"
        if (precentageStr === "<2"){
            return "Impaired"
        }
        if (precentageStr === "3-9") {
            return "Borderline"
        }
        if (precentageStr === "10-16") {
            return "Low Average"
        }
        if (precentageStr === "17-25") {
            return "Low Average"
        }
        if (precentageStr === "26-50") {
            return "Average"
        }
        if (precentageStr === "51-75") {
            return "Average"
        }
        return "High Average"
    }
}

// tslint:disable-next-line:max-classes-per-file
export class WMS4VR1 extends WMS4Basic{
    name: string = "WMS4VR1";
    id: string = "62769edb6ce1d026cf0c606c";
    limitRes = 43;
}

// tslint:disable-next-line:max-classes-per-file
export class WMS4VR2 extends WMS4Basic{
    name: string = "WMS4VR1";
    id: string = "6276a21e6ce1d026cf0c606d";
    limitRes = 43;
}

// tslint:disable-next-line:max-classes-per-file
export class WMS4VRRec extends WMS4Basic{
    name: string = "WMS4VRRec";
    id: string = "627697d46ce1d026cf0c606b";
    typeOfStatistics=2
    limitRes = 7;
    public getPrecentageToTest (precentage:number[]){
        const precentageStr = precentage[0].toString()
        // "<2", "3-9", "10-16", "17-25", "26-50", "51-75", ">75"
        if (precentageStr === "<2"){
            return "Impaired"
        }
        if (precentageStr === "3-9") {
            return "Borderline"
        }
        if (precentageStr === "10-16") {
            return "Low Average"
        }
        if (precentageStr === "17-25") {
            return "Low Average"
        }
        if (precentageStr === "26-50") {
            return "Average"
        }
        if (precentageStr === "51-75") {
            return "Average"
        }
        return "High Average"
    }
}

export const allWMS4 = [ new WMS4LM1(), new WMS4LM2(), new WMS4LMRec(), new WMS4VR1(), new WMS4VR2(), new WMS4VRRec()]