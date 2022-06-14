import { StatisticTesting } from "../statistical.interface"
import { ObjectId } from "mongodb";
import { collections } from "../../database.service";
import { Stats } from "../../../database/DBclasses";

export class Hooper extends StatisticTesting {
    norms: string = "Manual";
    data: any;
    name: string = "Hooper";
    id: string = "62715d9cc1d4e1e18a3055b7";
    idConversion="627155e7255eb4e782d0f309";
    dataConversion:any;
    usingAge: boolean = true;
    usingEducation: boolean = true;
    usingGender: boolean = false;
    typeOfStatistics: number = 1; // using T testing
    public async Constructor () {
        await super.Constructor();
        try {
            const query = { _id: new ObjectId(this.idConversion) };
            const stat = (await collections.stat.findOne(query)) as unknown as Stats;
            if (stat) {
               this.dataConversion = stat.data
            }
        } catch (error) {
            // tslint:disable-next-line:no-console
            console.log(error.message)
        }
    };
    public getValidResult(age: number, gender: boolean, education: number, result: number[]): {} {
        let educationSrt = education.toString()
        let ageStr=""
        if(education <=  6){
            educationSrt="0-6"
        } else if (education > 16){
            educationSrt="16"
        }
        if(age >= 30 && age <= 34 ){
            ageStr = "30-34"
        } else {// if (age >= 35 && age <= 39){
            ageStr="35-39"
        }
        return [this.data[this.dataConversion[ageStr][educationSrt][result[0]]]];
    }
    getCorrection(): {} {
        return "A + E"
     }
}