import { precentageToTest } from "../../statistical/statisticalConversion";
import { PartOfReport } from "../getAutomatePart";
export class Speech extends PartOfReport{
    name : string = "Speech"
    tests : string[] = ["min","max","FAS", "Animals", "BNT", "WAIS5VCI"]
    arraySkip: number[]= [2,4,5,6]
    text : string[];
    textID: string="6298de58eabc345e1a4b3ab9"
    public getFilledText(name:string, gender:boolean, results:any[]):string{
        let minP = 100
        let maxP =0
        for (const test of results){
            if(this.tests.indexOf(test.name) === -1){
                continue
            }
            const per = test.precentage[0]
            if(per < minP){
                minP = per
            }
            if(per > maxP){
                maxP = per
            }
        }
        results.push({
            name:"min",
            score:[minP],
            precentage:[minP],
            raiting:precentageToTest(minP)
        })
        results.push({
            name:"max",
            score:[maxP],
            precentage:[maxP],
            raiting:precentageToTest(maxP)
        })
        return super.getFilledText(name,gender,results)
    }
}