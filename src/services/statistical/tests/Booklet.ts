import { StatisticTesting } from "../statistical.interface"
export class Booklet extends StatisticTesting {
    norms: string = "Manual";
    data: any;
    name: string = "Booklet";
    id: string = "62716c64fa832f43fee9de6e";
    usingAge: boolean = true;
    usingEducation: boolean = true;
    usingGender: boolean = true;
    typeOfStatistics: number = 1; // using T testing
    getPrecentage: (finalRes: number[]) => number[];
    Constructor: () => Promise<void>;
    getValidResult(age: number, gender: boolean, education: number, result: number[]): {} {
        let ageStr = ""
        if(age >= 20 && age <= 34 ){
            ageStr = "20-34"
        } else {// if (age >= 35 && age <= 39){
            ageStr="35-39"
        }
        let educationStr = ""
        // 6.0-8.0	9.0-11.0	12	13.0-15.0	16.0-17.0	>=18
        if ( education <= 8){
            educationStr = "6-8"
        } else if(education <= 11) {
            educationStr = "9-11"
        } else if(education <= 12) {
            educationStr = "12"
        } else if(education <= 15) {
            educationStr = "13-15"
        } else if(education <= 17) {
            educationStr = "16-17"
        } else{
            educationStr = "18-50"
        }
        let genderStr = "M"
        if(gender){
            genderStr="F"
        }
        let resultStr = ""
        const borders = [5,6,8,10,12,14,17,21,27,35,47,59,73,83,95,107,117,124,135,208]
        let prev =0
        for(const i in borders){
            if(result[0] <= borders[i]){
                resultStr= (prev).toString()+"-"+borders[i].toString()
                break
            } else {
                prev=borders[i]+1
            }
        }
        if(prev === 6){
            resultStr = "6"
        }
        return [this.data[genderStr][ageStr][educationStr][resultStr]]

    }

    getCorrection(): {} {
        return "G + A + E"
    }
}
