import { StatisticTesting } from "../statistical.interface";
import * as statsFunction from "../statisticalConversion";
abstract class ACTBasic extends StatisticTesting{
    norms: string = "Stuss et al. (1988)";
    usingAge: boolean = true;
    usingEducation: boolean = false;
    usingGender: boolean = false;
    typeOfStatistics: number = 0; // using Z testing
    getPrecentage: (finalRes: number[]) => number[];
    Constructor: () => Promise<void>;
    getValidResult(age: number, gender: boolean, education: number, result: number[]): {} {
        age=Math.round(age/5) * 5; // round to the nearest number that's devided by 5
        let ageStr = ""
        // set limits to the age
        if(age >= 30 && age <= 49 ){
            ageStr = "30-49"
        } else {// if (age >= 50 && age <= 69){
            ageStr="30-49"
        }
        return this.data[ageStr][result[0]]
    }
    getCorrection(): {} {
        return "A"
    }
}

// tslint:disable-next-line:max-classes-per-file
class ACT9sec extends ACTBasic{
    name="ACT9sec"
    id = "6270efb734ccecb000c4c599"
}


// tslint:disable-next-line:max-classes-per-file
class ACT18sec extends ACTBasic{
    name="ACT18sec"
    id = "6270f04b34ccecb000c4c59a"
}

// tslint:disable-next-line:max-classes-per-file
class ACT36sec extends ACTBasic{
    name="ACT36sec"
    id = "6270f09734ccecb000c4c59b"
}

// tslint:disable-next-line:max-classes-per-file
export class ACT extends StatisticTesting{
    name="ACT"
    id=""
    data=""
    norms: string = "Stuss et al. (1988)";
    typeOfStatistics=0;
    act9 = new ACT9sec()
    act18 = new ACT18sec()
    act36 = new ACT36sec()
    public async Constructor () {
        await this.act9.Constructor();
        await this.act18.Constructor();
        await this.act36.Constructor();
    }
    public getValidResult(age: number, gender: boolean, education: number, result: number[]): {} {
        return [this.act9.getValidResult(age,gender,education,[result[0]]),
        this.act18.getValidResult(age,gender,education,[result[1]]),
        this.act36.getValidResult(age,gender,education,[result[2]])]
    }
    getCorrection(): {} {
        return "A"
    }
    public getPrecentageToTest (precentage:number[]){
        const maxVal = statsFunction.precentageToTest( Math.max(...precentage))
        const minVal = statsFunction.precentageToTest( Math.min(...precentage))
        if( maxVal === minVal){
            return minVal
        }
        return minVal+" - "+maxVal;
    }

}