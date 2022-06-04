import { CognitiveSymptoms } from "./CognitiveSymptoms";
export class PhysicalSymptoms extends CognitiveSymptoms{
    name="PhysicalSymptoms"

    public getFilledText(name:string, gender:boolean, results:any[]):string{
        return super.getFilledText(name,gender,results).replace("cognitive symptoms","physical symptoms")
    }
}