import { precentageToTest } from "../../statistical/statisticalConversion";
import { PartOfReport } from "../getAutomatePart";
export class Attention extends PartOfReport{
    name : string = "Attention"
    text : string[];
    textID = "6298d7d5eabc345e1a4b3ab2"
    arraySkip: number[]= [4,5,6,7,8,9,10,12,15]
    tests : string[] = ["WAIS5DSF","WAIS5DSB", "WAIS5DSS", "WAIS5DS", "WAIS5AR", "WAIS5WMI","WAIS5PSI", "WAIS5CD", "WAIS5SS", "TrialsA", "StroopWords", "StroopColor", "ACT9", "ACT18", "ACT36"]
    public getFilledText(name:string, gender:boolean, results:any[]):string{
        const ACT = this.getNameInRes("ACT",results)
        if(ACT!== undefined){
            results.push({
                name:"ACT9",
                score:[ACT.score[0]],
                precentage:[ACT.precentage[0]],
                raiting:precentageToTest(ACT.precentage[0])
            })
            results.push({
                name:"ACT18",
                score:[ACT.score[1]],
                precentage:[ACT.precentage[1]],
                raiting:precentageToTest(ACT.precentage[1])
            })
            results.push({
                name:"ACT36",
                score:[ACT.score[2]],
                precentage:[ACT.precentage[2]],
                raiting:precentageToTest(ACT.precentage[2])
            })
        }
        let str = super.getFilledText(name,gender,results);
        let connor = ""
        for (const key of results){
            if(key.name.indexOf("CPT3")> -1){
                let rating = key.raiting
                if(rating.indexOf(";") > -1){
                    rating = rating.split(";")[1]
                }
                connor = connor+" "+rating+","
            }
        }
        if(connor !== ""){
            str= str +"The results of "+name+" in the Connors’ CPT-3 were as following: "+connor
        }
        return str
    }
}



