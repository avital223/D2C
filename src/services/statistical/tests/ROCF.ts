import { StatisticTesting } from "../statistical.interface"
import * as statsFunction from "../statisticalConversion"

abstract class ROCFBasec extends StatisticTesting{
    norms: string = "Manual";
    usingAge: boolean = true;
    usingEducation: boolean = false;
    usingGender: boolean = false;
    min : number;
    max: number;
    typeOfStatistics: number = 1; // using IQ testing
    getValidResult(age: number, gender: boolean, education: number, result: number[]): {} {
        let ageStr = ""
        if(age <= 34){
            ageStr = "30-34"
        } else{
            ageStr = "35-39"
        }
        let resultStr = result[0].toFixed(1)
        if ( result[0]<  this.min ){
            resultStr = this.min.toFixed(1)
        } else if ( result[0] > 36){
            resultStr = this.max.toFixed(1)
        }
        return [this.data[ageStr][resultStr]]
    }

    getCorrection(): {} {
       return "A"
    }
}

// tslint:disable-next-line:max-classes-per-file
export class ROCFIR extends ROCFBasec{
    name: string = "ROCFIR";
    id: string = "6281385404eb1696d21aec19";
    min=10
    max=36
}

// tslint:disable-next-line:max-classes-per-file
export class ROCFDR extends ROCFBasec{
    name: string = "ROCFDR";
    id: string = "62813a374753fd8846c81f32";
    min=10
    max=36
}

// tslint:disable-next-line:max-classes-per-file
export class ROCFRec extends ROCFBasec{
    name: string = "ROCFRec";
    id: string = "62813c634753fd8846c81f33";
    min=17
    max=24
}

// tslint:disable-next-line:max-classes-per-file
export class ROCFCopy extends ROCFBasec{
    name: string = "ROCFCopy";
    id: string = "62814354c1511e9af6c0ed9c";
    min=0
    max=36
    typeOfStatistics=2
    public getPrecentageToTest (precentage:number[]){
        const precentageStr = precentage[0].toString()
        // ">16", "11.0-16.0", "6.0-10.0", "2.0-5.0", "<=1"
        if (precentageStr === "<=1"){
            return "Impaired"
        }
        if (precentageStr === "2.0-5.0") {
            return "Borderline"
        }
        if (precentageStr === "6.0-10.0") {
            return "Low Average"
        }
        if (precentageStr === "11.0-16.0") {
            return "Low Average"
        }
        return "Average"
    }
}