import { CognitiveSymptoms } from "./CognitiveSymptoms";
export class PsychologicalSymptoms extends CognitiveSymptoms{
    name="PsychologicalSymptoms"

    public getFilledText(name:string, gender:boolean, results:any[]):string{
        return super.getFilledText(name,gender,results).replace("cognitive symptoms","psychological symptoms")
    }
}