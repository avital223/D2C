import { StatisticTesting } from "../statistical.interface"

abstract class MitrushinaBasic extends StatisticTesting{
    norms: string = "Heaton et al. (2004)";
    usingAge: boolean = true;
    usingEducation: boolean;
    usingGender: boolean = false;
    typeOfStatistics: number = 0; // using Z test
    getValidResult(age: number, gender: boolean, education: number, result: number[]): {} {
        let ageStr = ""
        // Fild the low bound of the age
        let ageBound=Math.floor(age/5) * 5;
        let ageUp
        if(ageBound < 16 && this.usingEducation){
            ageBound = 16
            ageUp=19
        } else if ( ageBound < 25){
            ageBound = 25
            ageUp = 29
        } else{
            ageUp = ageBound + 4
        }
        ageStr=ageBound.toString()+"-"+ageUp.toString()
        let educationStr = education.toString()
        if(education < 10){
            educationStr="10"
        } else if (education > 17){
            educationStr="17"
        }
        if ( this.usingEducation){
            return [(result[0]- this.data.age[ageStr].mean - this.data.education[educationStr])/this.data.age[ageStr].std]
        }
        return [(result[0]- this.data[ageStr].mean)/this.data[ageStr].std]
    }

    getCorrection(): {} {
        if( this.usingEducation){
            return "A + E"
        } else {
            return "A"
        }
    }
}

// tslint:disable-next-line:max-classes-per-file
export class TrialsA extends MitrushinaBasic{
    name="TrialsA"
    id = "62908867667b3355aa168b84"
    usingEducation: boolean= true;
}
// tslint:disable-next-line:max-classes-per-file
export class TrialsB extends MitrushinaBasic{
    name="TrialsB"
    id = "62908a60a43689fc3b68b022"
    usingEducation: boolean= true;
}
// tslint:disable-next-line:max-classes-per-file
export class FAS extends MitrushinaBasic{
    name="FAS"
    id = "62908d1487449622df86775d"
    usingEducation: boolean= true;
}
// tslint:disable-next-line:max-classes-per-file
export class Animals extends MitrushinaBasic{
    name="Animals"
    id = "62908e8d87449622df86775e"
    usingEducation: boolean= false;
}
// tslint:disable-next-line:max-classes-per-file
export class BNT extends MitrushinaBasic{
    name="BNT"
    id = "62908fe34b401912aacfb9d0"
    usingEducation: boolean= false;
}