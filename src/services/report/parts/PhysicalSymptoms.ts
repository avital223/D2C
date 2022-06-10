import { CognitiveSymptoms } from "./CognitiveSymptoms";
export class PhysicalSymptoms extends CognitiveSymptoms{
    name="PhysicalSymptoms"

    public async Constructor(): Promise<void> {
        await super.Constructor();
        for(let i=0;i< this.text.length;i++){
            this.text[i] = this.text[i].replaceAll("{Cognitive","{Physical")
        }
        for(let i=0;i<this.tests.length;i++){
            this.tests[i] = this.tests[i].replace("Cognitive","Physical")
        }
    }
    public getFilledText(name:string, gender:boolean, results:any[]):string{
        return super.getFilledText(name,gender,results).replaceAll("cognitive symptoms","physical symptoms")
    }
}