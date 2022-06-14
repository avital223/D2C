import { precentageToTest } from "../../statistical/statisticalConversion";
import { PartOfReport } from "../getAutomatePart";
export class FrontalSystems extends PartOfReport{
    name : string = "FrontalSystems"
    tests : string[] = ["WAIS5MR","StroopColorWords","WAIS5SI", "RFFTSD", "RFFTER", "variable", "WCSTCC", "WCSTTC","WCSTSL", "TrialsB", "FAS", "Animals", "struggled",
                        "ACT9","ACT18","AVT36"]
    arraySkip: number[]= [1,2,3,5,6,7,8,9,10,12,17]
    text : string[] ;
    textID: string="6298da49eabc345e1a4b3ab4"
        public getFilledText(name:string, gender:boolean, results:any[]):string{
            const WCST = ["WCSTCC", "WCSTTC","WCSTSL"]
            let ranking = ""
            let variable = "mostly the same"
            for(const i of WCST){
                const test =  this.getNameInRes(i,results)
                if(ranking === ""){
                    ranking=test.raiting
                } else if (ranking !== test.raiting){
                    variable = "variable"
                    break
                }
            }
            const ACT = this.getNameInRes("ACT",results)
            let struggled = ""
            let count=0
            if(ACT!== undefined){
                for (const i of ACT.precentage){
                    if ( i >= 50){
                        count+=1
                    }
                }
                switch (count){
                    case 0:
                        struggled="struggled"
                        break;
                    case 1:
                        struggled="mostly struggled"
                        break;
                    case 2:
                        struggled="mostly did not struggle"
                        break;
                    case 3:
                        struggled="did not struggle"
                        break;
                }
                results.push({
                    name:"variable",
                    score:[0],
                    precentage:[0],
                    raiting:variable
                })
                results.push({
                    name:"struggled",
                    score:[0],
                    precentage:[0],
                    raiting:struggled
                })
                results.push({
                    name:"ACT9",
                    score:[ACT.score[0]],
                    precentage:[ACT.precentage[0]],
                    raiting:precentageToTest(ACT.precentage[0])
                })
                results.push({
                    name:"ACT18",
                    score:[ACT.score[1]],
                    precentage:[ACT.precentage[3]],
                    raiting:precentageToTest(ACT.precentage[3])
                })
                results.push({
                    name:"ACT36",
                    score:[ACT.score[2]],
                    precentage:[ACT.precentage[2]],
                    raiting:precentageToTest(ACT.precentage[2])
                })
            }
            return super.getFilledText(name,gender,results);
        }
}