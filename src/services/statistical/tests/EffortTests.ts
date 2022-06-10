import { StatisticTesting } from "../statistical.interface"

abstract class EffortBasic extends StatisticTesting{
    norms: string = "Manual";
    usingAge: boolean = false;
    usingEducation: boolean = false;
    usingGender: boolean = false;
    typeOfStatistics: number = 2;
    getValidResult(age: number, gender: boolean, education: number, result: number[]): {} {
        if(result[0] <= this.data[result[1].toString()]){
            return [1]
        }
        return [0]
    }

    getCorrection(): {} {
        return "N/A"
    }

    getPrecentageToTest(precentage:number[]) : string{
        if (precentage[0] === 1){
            return "Normal Effort"
        }
        return "Susspect Effort"
    }
}
// tslint:disable-next-line:max-classes-per-file
export class BTest extends EffortBasic{
    name="BTest"
    id = "6290d588c01fa21730ae0c17"
}

// tslint:disable-next-line:max-classes-per-file
export class DCT extends EffortBasic{
    name="DCT"
    id = "6290d5b2b9187304ce47857e"
}

// tslint:disable-next-line:max-classes-per-file
export class TOMM extends EffortBasic{
    name="TOMM"
    id = "-"
    public Constructor(): Promise<void> {
        return
    }
    getValidResult(age: number, gender: boolean, education: number, result: number[]): {} {
        if (result[1] >= 45){
            return [0]
        }
        return [1]
    }
    getPrecentageToTest(precentage:number[]) : string{
        if (precentage[0] === 1){
            return "Not Valid"
        }
        return "Valid"
    }
}