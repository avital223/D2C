import * as statsFunction from "./statisticalConversion"
import { ObjectId } from "mongodb";
import { collections } from "../database.service";
import { Stats } from "../../database/DBclasses";
export abstract class StatisticTesting {
    name: string;
    id: string;
    public norms: string;
    // using is for which factors needed to be considered while calculating the statistical test.
    usingAge: boolean;
    usingEducation: boolean;
    usingGender: boolean;
    // Type os the statistical test preforned in this test
    // 0 - Z test (or SS) , 1 - T test, 2- Pracentile Rank, 3 - IQ score,
    typeOfStatistics: number;
    data: any;
    public abstract getValidResult(age: number, gender:boolean, education:number, result:number[]): {};
    public getPrecentage (finalRes:number[]) {
        const perArray:number[] = []
        for (const res of finalRes){
            if(this.typeOfStatistics === 1){
                perArray.push(Math.floor(statsFunction.tToPresantege(res)))
            }
            else if (this.typeOfStatistics === 0){
                perArray.push(Math.floor(statsFunction.zToPrecentage(res)))
            } else if (this.typeOfStatistics === 3){
                perArray.push(Math.floor(statsFunction.iqToPrecentage(res)))
            } else if (this.typeOfStatistics === 4){
                perArray.push(Math.floor(statsFunction.iqToPrecentage(50 + 5* res)))
            } else{
                perArray.push(res)
            }
        }
        return perArray
    }
    public async Constructor () {
        try {
            const query = { _id: new ObjectId(this.id) };
            const stat = (await collections.stat.findOne(query)) as unknown as Stats;
            if (stat) {
               this.data = stat.data
            }
        } catch (error) {
            // tslint:disable-next-line:no-console
            console.log(error.message)
        }
    }
    public getPrecentageToTest (precentage:number[]) : string{
        return statsFunction.precentageToTest(precentage[0])
    }
    public abstract getCorrection():{};

    public getNorms(){
        return this.norms
    }
}


