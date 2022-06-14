import { CognitiveSymptoms } from "./CognitiveSymptoms";
export class PsychologicalSymptoms extends CognitiveSymptoms{
    name="PsychologicalSymptoms"

    public async Constructor(): Promise<void> {
        await super.Constructor();
        for(let i=0;i< this.text.length;i++){
            this.text[i] = this.text[i].replaceAll("{Cognitive","{Psychological")
        }
        for(let i=0;i<this.tests.length;i++){
            this.tests[i] = this.tests[i].replace("Cognitive","Psychological")
        }
    }
    public getFilledText(name:string, gender:boolean, results:any[]):string{
        return super.getFilledText(name,gender,results).replaceAll("cognitive symptoms","psychological symptoms")
    }
}