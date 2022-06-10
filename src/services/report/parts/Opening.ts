import { PartOfReport } from "../getAutomatePart";
export class Opening extends PartOfReport{
    name : string = "Opening"
    tests : string[] = [""]
    text : string[];
    textID: string="6298dcedeabc345e1a4b3ab8"
    public getFilledText(name:string, gender:boolean, results:any):string{
        return this.text[0].replace("{name}",name)
    }
}