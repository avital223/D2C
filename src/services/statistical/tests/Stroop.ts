import { StatisticTesting } from "./statistical.interface"
import { ObjectId } from "mongodb";
import { collections } from "../database.service";
import { Stats } from "../../database/DBclasses";


abstract class StroopBasic extends StatisticTesting{
    norms: string = "Manual";
    idConversion:string;
    dataConversion : any;
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
    getPrecentage: (finalRes: number) => number;
    getValidResult(age: number, gender: boolean, education: number, result: number[]): {} {
        age=Math.round(age/5) * 5; // round to the nearest number that's devided by 5
        let ageStr = age.toString()
        // set limits to the age
        if(age < 15 ){ 
            ageStr = "15"
        } else if (age > 100){
            ageStr="100"
        }
        // set limits to the education
        let educationStr = education.toString()
        if(education < 0){
            educationStr = "0"
        } else if(education > 20){
            educationStr = "20"
        }
        //calculate the result
        let difference = result[0] - this.data[ageStr][educationStr]
        if(difference < -50){
            difference = -50
        } else if (difference > 50){
            difference = 50
        }
        return this.dataConversion[difference.toString()]
    }
    getCorrection(): {} {
       return "A + E"
    }
}

// tslint:disable-next-line:max-classes-per-file
export class StroopColor extends StroopBasic {
    name: string = "StroopColor";
    id: string = "626d236f34176bb3d5f85879";
    idConversion="626d37e8fddc4ad522365d7c";
}

// tslint:disable-next-line:max-classes-per-file
export class StroopWords extends StroopBasic {
    name: string = "StroopWords";
    id: string = "626d47d237e873bdbdbd3a85";
    idConversion="626d4a705dc1834c32de9ed9";
}


// tslint:disable-next-line:max-classes-per-file
export class StroopClolorWords extends StroopBasic {
    name: string = "StroopClolorWords";
    id: string = "626d685f7e1152da8e425df1";
    idConversion="626d6a2a445f775ae4813675";
    idPredict="626d815596ec29d212bee6c1"
    dataPredict:number[][]
    public async Constructor () {
        await super.Constructor();
        try {
            const query = { _id: new ObjectId(this.idPredict) };
            const stat = (await collections.stat.findOne(query)) as unknown as Stats;
            if (stat) {
               this.dataPredict = stat.data as number[][]
            }
        } catch (error) {
            // tslint:disable-next-line:no-console
            console.log(error.message)
        }
    }
    getValidResult(age: number, gender: boolean, education: number, result: number[]): {} {
        age=Math.round(age/5) * 5; // round to the nearest number that's devided by 5
        let ageStr = age.toString()
        // set limits to the age
        if(age < 15 ){
            ageStr = "15"
        } else if (age > 100){
            ageStr="100"
        }
        // set limits to the education
        let educationStr = education.toString()
        if(education < 0){
            educationStr = "0"
        } else if(education > 20){
            educationStr = "20"
        }
        // calculate the result.
        let wordResult = Math.round((result[0]-2)/4)
        if(wordResult > 33){
            wordResult = 33
        }
        let colorResult = Math.round((result[1]-2)/4)
        if(colorResult > 28){
            colorResult = 28
        }
        let difference = this.dataPredict[wordResult][colorResult] - this.data[ageStr][educationStr] + result[2]
        if(difference < -50){
            difference = -50
        } else if (difference > 50){
            difference = 50
        }
        return this.dataConversion[difference.toString()]
    }
}
