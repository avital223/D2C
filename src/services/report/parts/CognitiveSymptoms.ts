import { PartOfReport } from "../getAutomatePart";
export class CognitiveSymptoms extends PartOfReport{
    name : string = "CognitiveSymptoms"
    tests : string[] = ["Cognitive Questionnare"]
    text : string[] = [""]
    textID=""
    public Constructor(): Promise<void> {
        return
    }
    public getFilledText(name:string, gender:boolean, results:any):string{
        return ""
    }
}