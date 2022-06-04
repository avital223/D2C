import { ObjectId } from "mongodb";
import { collections } from "../database.service";
import { Stats } from "../../database/DBclasses";
import { pushd } from "shelljs";
export abstract class PartOfReport
{
    name : string;
    tests : string[]
    text : string[]
    arraySkip: number[]
    textID:string
    protected getNameInRes(name:string, results:any[]){
        for(const i of results){
            if(i.name === name){
                return i
            }
        }
        return undefined
    }

    public async Constructor () {
        try {
            const query = { _id: new ObjectId(this.textID) };
            const stat = await collections.report.findOne(query);
            if (stat) {
               this.text = stat.text
            }
        } catch (error) {
            // tslint:disable-next-line:no-console
            console.log(error.message)
        }
    }
    // note R - rating S - score and P - precentage
    public getFilledText(name:string, gender:boolean, results:any[]):string{
        let str = ""
        let genders = "his"
        let genderS = "His"
        let genderm = "him"
        let genderM = "Him"
        let genderg = "he"
        let genderG = "He"
        if(gender){
            genders="her"
            genderS="Her"
            genderm="her"
            genderg="she"
            genderM="Her"
            genderG="She"
        }
        let countSentences = 0
        let countTest = 0
        const sentences = []
        for (const i of this.text){
            sentences.push(true)
        }
        for (const test of this.tests){
            if(this.arraySkip.indexOf(countTest) > -1){
                countSentences+=1
            }
            const testFull = this.getNameInRes(test,results)
            if(testFull === undefined){
                sentences[countSentences] = false
            }
            countTest +=1
        }
        countSentences = 0
        let prevI =0
        for ( const sentence of this.text){
            if(sentences[countSentences]){
                // @ts-ignore: Unreachable code error
                let newSentence=sentence.replaceAll("{gender}",genderg).replaceAll("{genderS}",genderS).replaceAll("{genders}",genders).replaceAll("{genderm}",genderm)
                .replaceAll("{genderG}",genderG).replaceAll("{genderM}",genderM).replaceAll("{name}",name)
                for (let i=prevI; i<this.arraySkip[countSentences];i++){
                    const repTest=this.getNameInRes(this.tests[i],results)
                    let pre = ""
                    if(repTest.precentage.length > 0){
                        pre = repTest.precentage[0].toString();
                        if(pre.indexOf(">") === -1 && pre.indexOf("<") === -1 && pre.indexOf("-") === -1){
                            pre = Math.floor(repTest.precentage[0] as number).toString()
                        }
                    }
                    newSentence = newSentence.replaceAll("{"+this.tests[i]+"S}", repTest.score[0]).replaceAll("{"+this.tests[i]+"R}", repTest.raiting)
                    .replaceAll("{"+this.tests[i]+"P}", pre)
                }
                str+=newSentence
            }
            prevI = this.arraySkip[countSentences]
            countSentences=countSentences+1
        }
        return str
    }
}
