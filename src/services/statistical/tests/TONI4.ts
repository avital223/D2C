import { StatisticTesting } from "../statistical.interface"
export class TONI4 extends StatisticTesting {
    norms: string = "Manual";
    data: any;
    name: string = "TONI4";
    id: string = "62a9f7b4c136e2a966e7723f";
    usingAge: boolean = true;
    usingEducation: boolean = false;
    usingGender: boolean = false;
    typeOfStatistics: number = 3; // using IQ testing
    getPrecentage: (finalRes: number[]) => number[];
    Constructor: () => Promise<void>;
    getValidResult(age: number, gender: boolean, education: number, result: number[]): {} {
        let ageStr = ""
        if(age <= 6 ){
            ageStr = "0-45"
        } else if ( age <= 18){
            ageStr=age.toString()
        } else if(age <=29){
            ageStr = "19-29"
        } else if(age <=39){
            ageStr = "30-39"
        } else if(age <=49){
            ageStr = "40-49"
        } else if(age <=59){
            ageStr = "50-59"
        } else if(age <=64){
            ageStr = "60-64"
        } else if(age <=69){
            ageStr = "65-69"
        } else{
            ageStr = "70-89"
        }
        let resultStr = result[0].toString()
        if ( result[0] > 60){
            resultStr = "60"
        }
        return [this.data[ageStr][resultStr]]

    }

    getCorrection(): {} {
        return "A"
    }
}