import { precentageToTest } from "../../statistical/statisticalConversion";
import { PartOfReport } from "../getAutomatePart";
export class Emotional extends PartOfReport{
    name : string = "Emotional"
    tests : string[] = ["BDI-II","BDI-IIlist1","BDI-IIlist2","BDI-IIlist3", "BAI", "BAIlist1", "BAIlist2", "BAIlist3"]
    arraySkip: number[]= [4,5,6,7,8]
    textID: string="6298d9e3eabc345e1a4b3ab3"
}