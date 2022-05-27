import { StatisticTesting } from "../statistical.interface"

export class MMSE extends StatisticTesting {
    norms: string = "Manual";
    data: any;
    name: string = "MMSE";
    id: string = "626bb0acdb211ffe6a9642a5";
    usingAge: boolean = true;
    usingEducation: boolean = true;
    usingGender: boolean = false;
    typeOfStatistics: number = 1; // using T testing
    getPrecentage: (finalRes: number[]) => number[];
    Constructor: () => Promise<void>;
    private getScoreStr = (result:number, minLimit:number) => {
        let resultStr=""
        if(result <= minLimit){
            resultStr = "0-"+minLimit.toString()
        } else if (result >= 30) {
            resultStr = "30"
        } else {
            resultStr = result.toString()
        }
        return resultStr
    }
    getValidResult(age: number, gender: boolean, education: number, result: number[]): {} {
        let ageStr = ""
        let educationSrt = ""
        let resultStr = ""
        if(age >= 18 && age <= 24 ){
            ageStr="18-24"
            resultStr = this.getScoreStr(result[0],7)
        } else if (age >= 25 && age <= 29 ) {
            ageStr="25-29"
            resultStr = this.getScoreStr(result[0],14)
        } else if (age >= 30 && age <= 34 ) {
            ageStr="30-34"
            resultStr = this.getScoreStr(result[0],13)
        } else { // if (age >= 35 && age <= 39 ) {
            ageStr="35-39"
            resultStr = this.getScoreStr(result[0],10)
        }
        if(education >= 0 && education <= 4 ){
            educationSrt="0-4"
        } else if (education >= 5 && education <= 8 ) {
            educationSrt="5-8"
        } else if (education >= 9 && education <= 12 ) {
            educationSrt="9-12"
        } else {
            educationSrt="13-50"
        }
        if(this.data.hasOwnProperty(ageStr)){
            return [this.data[ageStr][educationSrt][resultStr]]
        }
    }

    getCorrection(): {} {
        return "A + E"
    }
}