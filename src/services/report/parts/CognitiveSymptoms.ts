import { PartOfReport } from "../getAutomatePart";
export class CognitiveSymptoms extends PartOfReport{
    name : string = "CognitiveSymptoms"
    tests : string[] = ["Cognitivelist1","Cognitivelist2","Cognitivelist3","Cognitivelist4","Cognitivelist5","Cognitivelist6","Cognitivelist7","Cognitivelist8"
    ,"Cognitivelist9","Cognitivelist10","Cognitivelist11","Cognitivelist12"]
    textID="629b522f080ef99d23859c9c"
    arraySkip: number[]=[0,3,5,8,12]
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
        sentences.push(true)
        for (const i of this.text){
            sentences.push(false)
        }
        for (const test of this.tests){
            if(this.arraySkip.indexOf(countTest) > -1){
                countSentences+=1
            }
            const testFull = this.getNameInRes(test,results)
            if(testFull !== undefined){
                sentences[countSentences] = true
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
                    let repTest=this.getNameInRes(this.tests[i],results)
                    if(repTest === undefined){
                        repTest = {
                            "name":this.tests[i],
                            "score":[0],
                            "precentage":[],
                            "raiting":""
                        }
                    }
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
                if(newSentence.indexOf(":")> -1){
                    const splitSencence = newSentence.split(":")
                    const arraySymtoms = splitSencence[1].split(",")
                    const newArray = []
                    for (const i in arraySymtoms){
                        if(arraySymtoms[i].trim()!=="" && arraySymtoms[i].trim()!=="."){
                            newArray.push(arraySymtoms[i].trim())
                        }
                    }
                    newSentence = splitSencence[0] + ": " + newArray.join(", ")
                }
                str+=newSentence
            }
            prevI = this.arraySkip[countSentences]
            countSentences=countSentences+1
        }
        return str
    }
}