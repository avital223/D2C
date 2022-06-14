import { precentageToTest } from "../../statistical/statisticalConversion";
import { PartOfReport } from "../getAutomatePart";
export class Visual extends PartOfReport{
    name : string = "Visual"
    tests : string[] = ["Hooper","ROCF","WAISVP", "WAIS5BD", "WAISPRI"]
    arraySkip: number[]= [0,1,2,3,4]
    text : string[];
    textID: string="6298dea0eabc345e1a4b3aba"
    public getFilledText(name:string, gender:boolean, results:any):string{
        let str = super.getFilledText(name,gender,results)
        let sumP =0
        let countP = 0
        for( const test of results){
            if(this.tests.indexOf(test.name)===-1){
                continue
            }
            sumP += test.precentage[0]
            countP +=1
        }
        const ranking = precentageToTest((sumP/countP))
        str = str.replace("{name}",name).replace("{}",ranking)
        return str
    }
}

