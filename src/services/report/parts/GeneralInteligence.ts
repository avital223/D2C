import { PartOfReport } from "../getAutomatePart";
export class GeneralIntelligence extends PartOfReport{
    name : string = "GeneralIntelligence"
    tests : string[] = ["WAIS5FSIQ"]
    text : string[] ;
    textID: string="6298db99eabc345e1a4b3ab5"

    public getFilledText(name:string, gender:boolean, results:any):string{
        let genders = "his"
        let genderS = "His"
        if(gender){
            genders="her"
            genderS="Her"
        }
        let str = ""
        const WAIS5FSIQ = this.getNameInRes("WAIS5FSIQ", results)
        if (WAIS5FSIQ === undefined){
            return ""
        } else {
            // @ts-ignore: Unreachable code error
            str += this.text[0].replaceAll("{name}", name).replaceAll("{WAIS5FSIQS}", WAIS5FSIQ.score[0]).replaceAll("{WAIS5FSIQR}", WAIS5FSIQ.raiting)
            .replaceAll("{WAIS5FSIQP}", Math.floor(WAIS5FSIQ.precentage[0] as number).toString()).replaceAll("{genders}", genders)
        }
        const TONI4 = this.getNameInRes("TONI4", results)
        if(TONI4 !== undefined){
            let exp = ""
            const perWAIS5 = Math.floor(WAIS5FSIQ.precentage[0])
            const perTONI = Math.floor(TONI4.precentage[0])
            if(perWAIS5 < perTONI){
                exp="somewhat below expectation"
            } else if (perWAIS5 > perTONI){
                exp="somewhat above expectation"
            } else{
                exp="as expected"
            }
            // @ts-ignore: Unreachable code error
            str+= this.text[1].replaceAll("{exp}",exp).replaceAll("{TONI4S}",TONI4.score[0]).replaceAll("{TONI4R}",perTONI.toString()).replaceAll("{genders}", genders)
        }
        const WAIS5VCI = this.getNameInRes("WAIS5VCI", results)
        if(WAIS5VCI!== undefined){
            // @ts-ignore: Unreachable code error
            str+=this.text[2].replaceAll("{genderS}", genderS).replaceAll("{WAIS5VCIS}", WAIS5VCI.score[0]).replaceAll("{WAIS5VCIR}", WAIS5VCI.raiting)
        }
        const WAIS5WMI = this.getNameInRes("WAIS5WMI", results)
        if(WAIS5WMI!== undefined){
            // @ts-ignore: Unreachable code error
            str+=this.text[3].replaceAll("{genders}", genders).replaceAll("{WAIS5WMIS}", WAIS5WMI.score[0]).replaceAll("{WAIS5WMIR}", WAIS5WMI.raiting)
        }
        const WAIS5PRI = this.getNameInRes("WAIS5PRI", results)
        if(WAIS5PRI!== undefined){
            // @ts-ignore: Unreachable code error
            str+=this.text[4].replaceAll("{genders}", genders).replaceAll("{WAIS5PRIS}", WAIS5PRI.score[0]).replaceAll("{WAIS5PRIR}", WAIS5PRI.raiting)
        }
        const WAIS5PSI = this.getNameInRes("WAIS5PSI", results)
        if(WAIS5PSI!== undefined){
            // @ts-ignore: Unreachable code error
            str+=this.text[5].replaceAll("{genders}", genders).replaceAll("{WAIS5PSIS}", WAIS5PSI.score[0]).replaceAll("{WAIS5PSIR}", WAIS5PSI.raiting)
        }
        return str
    }
}
