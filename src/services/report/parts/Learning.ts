import { precentageToTest } from "../../statistical/statisticalConversion";
import { PartOfReport } from "../getAutomatePart";
export class Learning extends PartOfReport{
    name : string = "Learning"
    tests : string[] = ["WMS4LM1","WMS4LM2","WMS4LMRec","RAVLTT1", "even", "RAVLTT2", "RAVLTT3", "RAVLTT4", "RAVLTT5","RAVLTTmin", "RAVLTTmax", "RAVLTT5", "RAVLTT1to5", "RAVLTTB",
                        "RAVLTShortDelay","RAVLTLongDelay","RAVLTRec","WMS4VR1","WMS4VR2", "improved", "WMS4VRec", "ROCFIR", "ROCFDR", "ROCFRec"]
    arraySkip: number[]= [2,3,4,9,11,12,13,14,15,17,19,20,21,22,23,24]
    text : string[];
    textID: string="6298dc43eabc345e1a4b3ab6"
    public getFilledText(name:string, gender:boolean, results:any[]):string{
        const RAVLTT1 = this.getNameInRes("RAVLTT1",results)
        const RAVLTT2 = this.getNameInRes("RAVLTT2",results)
        const RAVLTT3 = this.getNameInRes("RAVLTT3",results)
        const RAVLTT4 = this.getNameInRes("RAVLTT4",results)
        const RAVLTT5 = this.getNameInRes("RAVLTT5",results)
        const WMS4VRec = this.getNameInRes("WMS4VRec",results)
        const WMS4VR2 = this.getNameInRes("WMS4VR2",results)

        const arrayR = [RAVLTT2,RAVLTT3,RAVLTT4,RAVLTT5]
        let minP = RAVLTT1?.precentage[0]
        let maxP = RAVLTT1?.precentage[0]
        let prev = RAVLTT1
        let even:string = "even"
        if(RAVLTT1 !== undefined){
            for( const i of arrayR){
                if(i===undefined){
                    continue
                }
                if(prev.score[0] > i.score[0]){
                    even="uneven"
                }
                const per = i.precentage[0]
                if(per < minP){
                    minP = per
                }
                if(per > maxP){
                    maxP = per
                }
                prev = i
            }
        }
        let improve= "did not improve"
        if(WMS4VR2 !== undefined && WMS4VRec !== undefined){
            if(WMS4VRec.score[0] > WMS4VRec.score[0]){
                improve="improved"

            }
        }
        results.push({
            name:"even",
            score:[0],
            precentage:[0],
            raiting:even
        })
        results.push({
            name:"improve",
            score:[0],
            precentage:[0],
            raiting:improve
        })
        results.push({
            name:"RAVLTTmax",
            score:[maxP],
            precentage:[maxP],
            raiting:precentageToTest(maxP)
        })
        results.push({
            name:"RAVLTTmin",
            score:[minP],
            precentage:[minP],
            raiting:precentageToTest(minP)
        })
        return super.getFilledText(name,gender,results)
    }

}