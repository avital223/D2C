import { StatisticTesting } from "../statistical.interface"
import * as statsFunction from "../statisticalConversion"

abstract class WAIS5Basic extends StatisticTesting{
    norms: string = "Manual";
    usingAge: boolean = true;
    usingEducation: boolean = false;
    usingGender: boolean = false;
    includingOld = true;
    limitRes : number;
    typeOfStatistics: number = 4; // using IQ testing
    getValidResult(age: number, gender: boolean, education: number, result: number[]): {} {
        let ageStr = ""
        if(age <= 17){
            ageStr = "16-17"
        } else if (age <= 19){
            ageStr = "18-19"
        } else if (age <= 24){
            ageStr = "20-24"
        } else if (age <= 29){
            ageStr = "25-29"
        } else if (age <= 34){
            ageStr = "30-34"
        } else if (age <= 44){
            ageStr = "34-44"
        } else if (age <= 54){
            ageStr = "45-54"
        } else if (age <= 64){
            ageStr = "55-64"
            // some of the tests are ending at the age of 69.
        } else if (age <= 69 || !this.includingOld){
            ageStr = "65-69"
        } else if (age <= 74){
            ageStr = "70-74"
        } else if (age <= 79){
            ageStr = "75-79"
        } else if (age <= 84){
            ageStr = "80-84"
        } else{
            ageStr = "85-90"
        }
        let resultStr = result[0].toString()
        if ( result[0]< 0 ){
            resultStr = "0"
        } else if ( result[0] > this.limitRes){
            resultStr = this.limitRes.toString()
        }
        return [this.data[ageStr][resultStr]]
    }

    getCorrection(): {} {
       return "A"
    }
}

// tslint:disable-next-line:max-classes-per-file
export class WAIS5BD extends WAIS5Basic {
    name: string = "WAIS5BD";
    id: string = "6274eb51115ec22c7fe24c5e";
    limitRes = 66;
}

// tslint:disable-next-line:max-classes-per-file
export class WAIS5SI extends WAIS5Basic {
    name: string = "WAIS5SI";
    id: string = "6274f25b115ec22c7fe24c5f";
    limitRes = 36;
}

// tslint:disable-next-line:max-classes-per-file
export class WAIS5DS extends WAIS5Basic {
    name: string = "WAIS5DS";
    id: string = "627539e8115ec22c7fe24c60";
    limitRes = 48;
}

// tslint:disable-next-line:max-classes-per-file
export class WAIS5MR extends WAIS5Basic {
    name: string = "WAIS5MR";
    id: string = "62753cfb115ec22c7fe24c61";
    limitRes = 26;
}

// tslint:disable-next-line:max-classes-per-file
export class WAIS5VC extends WAIS5Basic {
    name: string = "WAIS5VC";
    id: string = "62753fdd115ec22c7fe24c62";
    limitRes = 57;
}

// tslint:disable-next-line:max-classes-per-file
export class WAIS5AR extends WAIS5Basic {
    name: string = "WAIS5AR";
    id: string = "62754276115ec22c7fe24c63";
    limitRes = 22;
}

// tslint:disable-next-line:max-classes-per-file
export class WAIS5SS extends WAIS5Basic {
    name: string = "WAIS5SS";
    id: string = "62754ca0115ec22c7fe24c64";
    limitRes = 60;
}

// tslint:disable-next-line:max-classes-per-file
export class WAIS5VP extends WAIS5Basic {
    name: string = "WAIS5VP";
    id: string = "62754efb115ec22c7fe24c65";
    limitRes = 26;
}

// tslint:disable-next-line:max-classes-per-file
export class WAIS5IN extends WAIS5Basic {
    name: string = "WAIS5IN";
    id: string = "6275514b115ec22c7fe24c66";
    limitRes = 26;
}

// tslint:disable-next-line:max-classes-per-file
export class WAIS5CD extends WAIS5Basic {
    name: string = "WAIS5CD";
    id: string = "627553e5115ec22c7fe24c67";
    limitRes = 135;
}

// tslint:disable-next-line:max-classes-per-file
export class WAIS5CO extends WAIS5Basic {
    name: string = "WAIS5CO";
    id: string = "62755708115ec22c7fe24c68";
    limitRes = 36;
}

// tslint:disable-next-line:max-classes-per-file
export class WAIS5PCm extends WAIS5Basic {
    name: string = "WAIS5PCm";
    id: string = "6275591b115ec22c7fe24c69";
    limitRes = 24;
}
// tslint:disable-next-line:max-classes-per-file
export class WAIS5LN extends WAIS5Basic {
    name: string = "WAIS5LN";
    includingOld = false;
    id: string = "62762e45136d572ae1ca13af";
    limitRes = 30;
}
// tslint:disable-next-line:max-classes-per-file
export class WAIS5FW extends WAIS5Basic {
    name: string = "WAIS5FW";
    id: string = "62762ff1136d572ae1ca13b0";
    limitRes = 27;
}
// tslint:disable-next-line:max-classes-per-file
export class WAIS5CA extends WAIS5Basic {
    name: string = "WAIS5CA";
    id: string = "62763182136d572ae1ca13b1";
    limitRes = 36;
}

// tslint:disable-next-line:max-classes-per-file
abstract class WAIS5FullTest extends StatisticTesting{
    norms: string = "Manual";
    usingAge: boolean = true;
    usingEducation: boolean = false;
    usingGender: boolean = false;
    numRes : number;
    subtests : WAIS5Basic[];
    additionalSubsets : string[];
    typeOfStatistics: number = 3; // using IQ testing
    public async Constructor () {
        await super.Constructor();
        for (const w of this.subtests){
            await w.Constructor()
        }
    }
    getPrecentage: (finalRes: number[]) => number[];
    getSumOfRes(age: number, gender: boolean, education: number,result:number[]): {} {
        let sum = 0
        let idx =0;
        let count = 0;
        for (const w of this.subtests){
            if (result[idx] !== -1 && (w.includingOld || age <= 69)){
                const array = w.getValidResult(age,gender,education,[result[idx]]) as number []
                sum+= array[0]
                count+=1
                if ( count === this.numRes){
                    idx +=1
                    break;
                }
            }
            idx +=1
        }
        if ( count !== this.numRes){
            sum = Math.floor(sum * this.numRes / count)
        }
        return sum
    }
    getValidResult(age: number, gender: boolean, education: number, result: number[]): {} {
        const sum = this.getSumOfRes(age,gender,education,result)
        return [this.data[sum.toString()]]
    }
    getCorrection(): {} {
       return "A"
    }
}


// tslint:disable-next-line:max-classes-per-file
export class WAIS5VCI extends WAIS5FullTest {
    name: string = "WAIS5VCI";
    id: string = "62763609136d572ae1ca13b2";
    subtests = [new WAIS5SI(), new WAIS5VC(), new WAIS5IN(), new WAIS5CO()]
    additionalSubsets = ["WAIS5CO"]
    numRes = 3
}

// tslint:disable-next-line:max-classes-per-file
export class WAIS5PRI extends WAIS5FullTest {
    name: string = "WAIS5PRI";
    id: string = "627636df136d572ae1ca13b3";
    subtests = [new WAIS5BD(), new WAIS5MR(), new WAIS5VP(), new WAIS5FW(), new WAIS5PCm()]
    additionalSubsets = ["WAIS5FW", "WAIS5PCm"]
    numRes = 3
}

// tslint:disable-next-line:max-classes-per-file
export class WAIS5WMI extends WAIS5FullTest {
    name: string = "WAIS5WMI";
    id: string = "62763840136d572ae1ca13b4";
    subtests = [new WAIS5DS(), new WAIS5AR(), new WAIS5LN()]
    additionalSubsets = ["WAIS5LN"]
    numRes = 2
}

// tslint:disable-next-line:max-classes-per-file
export class WAIS5PSI extends WAIS5FullTest {
    name: string = "WAIS5PSI";
    id: string = "627638dd136d572ae1ca13b5";
    subtests = [new WAIS5SS(), new WAIS5CD(), new WAIS5CA()]
    additionalSubsets = ["WAIS5CA"]
    numRes = 2
}
// tslint:disable-next-line:max-classes-per-file
export class WAIS5FSIQ extends StatisticTesting {
    name: string = "WAIS5FSIQ";
    id: string = "62763c79136d572ae1ca13b6";
    norm = "Manual"
    subtests = [new WAIS5VCI(), new WAIS5PRI(), new WAIS5WMI(), new WAIS5PSI()]
    typeOfStatistics: number = 3; // using IQ testing
    // order of the results are:
    // 0        1        2        3        4        5        6        7        8        9        10       11       12       13       14
    // WAIS5BD, WAIS5SI, WAIS5DS, WAIS5MR, WAIS5VC, WAIS5AR, WAIS5SS, WAIS5VP, WAIS5IN, WAIS5CD, WAIS5LN, WAIS5FW, WAIS5CO, WAIS5CA, WAIS5PCm
    subsetsIndexing = [[1,4,8,12],[0,3,7,11,14], [2,5,10], [6,9,13]]
    numRes = 4
    public async Constructor () {
        await super.Constructor();
        for (const w of this.subtests){
            await w.Constructor()
        }
    }
    public getValidResult(age: number, gender: boolean, education: number, result: number[]): {} {
        let sum = 0
        let idx =0;
        let count = 0;
        for (const w of this.subtests){
            const resSend = []
            for (const i of this.subsetsIndexing[idx]){
                resSend.push(result[i])
            }
            const array = w.getSumOfRes(age,gender,education,resSend) as number
            sum+= array
            count+=1
            idx +=1
        }
        if ( count !== this.numRes){
            sum = Math.floor(sum * this.numRes / count)
        }
        return [this.data[sum.toString()]]
    }
    public getCorrection(): {} {
        return "A"
    }
}

export const fullIQ = new WAIS5FSIQ();
const arr = []
for (const w of fullIQ.subtests){
    arr.push(...w.subtests)
}
export const allWAIS5 = [...arr, ...fullIQ.subtests, fullIQ]