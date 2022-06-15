import { StatisticTesting } from "../statistical.interface"
import { ObjectId } from "mongodb";
import { collections } from "../../database.service";
import { Stats } from "../../../database/DBclasses";
abstract class RFFTBasic extends StatisticTesting {
    norms: string = "Manual";
    usingAge: boolean = true;
    usingEducation: boolean = true;
    usingGender: boolean = false;
    idDiff:string
    dataDiff:any
    typeOfStatistics: number = 1; // using T testing
    minVal: number;
    maxVal: number;
    public async Constructor () {
        await super.Constructor();
        try {
            const query = { _id: new ObjectId(this.idDiff) };
            const stat = (await collections.stat.findOne(query)) as unknown as Stats;
            if (stat) {
               this.dataDiff = stat.data
            }
        } catch (error) {
            // tslint:disable-next-line:no-console
            console.log(error.message)
        }
    };
    getValidResult(age: number, gender: boolean, education: number, result: number[]): {} {
        let educationSrt=""
        if (education <= 12){
            educationSrt="<=12"
        } else if (education <=15 ){
            educationSrt="13-15"
        } else {
            educationSrt=">=16"
        }
        const ageStr = "25-39"
        // if(age <= 24 ){
        //     ageStr = "16-26"
        // } else if(age <= 39) {
        //     ageStr="25-39"
        // }  else if(age <= 54) {
        //     ageStr="40-54"
        // } else {
        //     ageStr="55-70"
        // }
        let resultStr = ""
        result[0] += (this.dataDiff[ageStr][educationSrt] as unknown as number)
        const json = this.data[ageStr]
        for (const i in json){
            if(!json.hasOwnProperty(i)) {
                continue;
            }
            const num = i as unknown as number
            if (result[0]<= num){
                resultStr = num.toString()
                break
            }
        }
        return [this.data[ageStr][resultStr]]

    }

    getCorrection(): {} {
        return "A + E"
    }


}
// tslint:disable-next-line:max-classes-per-file
export class RFFTSD extends RFFTBasic {
    name: string = "RFFTSD";
    id: string = "627e1999796f2c9ee0914742";
    idDiff: string = "627e6e6f98c9dad81ea99550"
}
// tslint:disable-next-line:max-classes-per-file
export class RFFTER extends RFFTBasic {
    name: string = "RFFTER";
    id: string = "627e8673cc94c7f47bb3b9fb";
    idDiff: string = "627e6ee098c9dad81ea99551"
    getValidResult(age: number, gender: boolean, education: number, result: number[]): {} {
        const newResult = [result[0]/result[1]]
        return super.getValidResult(age,gender,education,newResult)
    }
}
