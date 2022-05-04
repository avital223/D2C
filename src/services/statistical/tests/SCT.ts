import { StatisticTesting } from "../statistical.interface"
export class SCT extends StatisticTesting {
    norms: string = "Manual";
    data: any;
    name: string = "SCT";
    id: string = "62723b152b4bf4668b2931e6";
    usingAge: boolean = true;
    usingEducation: boolean = false;
    usingGender: boolean = false;
    typeOfStatistics: number = 1; // using T testing
    getPrecentage: (finalRes: number[]) => number[];
    Constructor: () => Promise<void>;
    getValidResult(age: number, gender: boolean, education: number, result: number[]): {} {
        let ageStr = ""
        if(age <= 45 ){
            ageStr = "0-45"
        } else {// if (age >= 35 && age <= 39){
            ageStr="46-100"
        }
        let resultStr = result[0].toString()
        if ( result[0] > 63){
            resultStr = "63"
        }
        return [this.data[ageStr][resultStr]]

    }

    getCorrection(): {} {
        return "A"
    }
}
