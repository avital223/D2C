import { StatisticTesting } from "../statistical.interface"

abstract class RAVLTBasic extends StatisticTesting{
    norms: string = "Manual";
    usingAge: boolean = true;
    usingEducation: boolean = false;
    usingGender: boolean = false;
    includingOld = true;
    typeOfStatistics: number = 0; // using T testing
    getValidResult(age: number, gender: boolean, education: number, result: number[]): {} {
        let ageStr = ""
        if (age <= 19){
            ageStr = "16-19"
        } if (age <= 29){
            ageStr = "20-29"
        } else if (age <= 39){
            ageStr = "30-39"
        } else if (age <= 49){
            ageStr = "40-49"
        } else if (age <= 59){
            ageStr = "50-59"
        } else if (age <= 69){
            ageStr = "60-69"
        } else{
            ageStr = "70-79"
        }
        return [(result[0] - this.data[ageStr].mean)/this.data[ageStr].std]
    }

    getCorrection(): {} {
       return "A"
    }
}
// tslint:disable-next-line:max-classes-per-file
export class RAVLTT1 extends RAVLTBasic{
    name: string = "RAVLTT1";
    id: string = "627fdf9d64cf9f4cd76deb8e";
}

// tslint:disable-next-line:max-classes-per-file
export class RAVLTT2 extends RAVLTBasic{
    name: string = "RAVLTT2";
    id: string = "627fe1a45eeb7aa469a92efd";
}

// tslint:disable-next-line:max-classes-per-file
export class RAVLTT3 extends RAVLTBasic{
    name: string = "RAVLTT3";
    id: string = "627fe249660ea9d79981bcf3";
}

// tslint:disable-next-line:max-classes-per-file
export class RAVLTT4 extends RAVLTBasic{
    name: string = "RAVLTT4";
    id: string = "627fe2f0c134d9e945631fe8";
}

// tslint:disable-next-line:max-classes-per-file
export class RAVLTT5 extends RAVLTBasic{
    name: string = "RAVLTT5";
    id: string = "627fe436847b8532dac3540a";
}

// tslint:disable-next-line:max-classes-per-file
export class RAVLTT1to5 extends RAVLTBasic{
    name: string = "RAVLTT1to5";
    id: string = "627feb8c3513d16dfca4914f";
    getValidResult(age: number, gender: boolean, education: number, result: number[]): {} {
        const sum = result[0]+result[1]+result[2]+result[3]+result[4]
        return super.getValidResult(age,gender,education,[sum])
    }
}

// tslint:disable-next-line:max-classes-per-file
export class RAVLTTB extends RAVLTBasic{
    name: string = "RAVLTTB";
    id: string = "627fec10614284b192b05e1a";
}

// tslint:disable-next-line:max-classes-per-file
export class RAVLTShortDelay extends RAVLTBasic{
    name: string = "RAVLTShortDelay";
    id: string = "627fecd9ec92f95fca5979e1";
}

// tslint:disable-next-line:max-classes-per-file
export class RAVLTLongDelay extends RAVLTBasic{
    name: string = "RAVLTLongDelay";
    id: string = "627fedc99bcbac04ea9401bd";
}

// tslint:disable-next-line:max-classes-per-file
export class RAVLTRec extends RAVLTBasic{
    name: string = "RAVLTRec";
    id: string = "627fee5b40c361e02d0fdbab";
}

export const allRAVLT = [new RAVLTT1(), new RAVLTT2(), new RAVLTT3(), new RAVLTT4(), new RAVLTT5(), new RAVLTT1to5(), new RAVLTTB(), new RAVLTShortDelay(),
     new RAVLTLongDelay(), new RAVLTRec()];