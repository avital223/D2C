import { precentageToTest } from "../../statistical/statisticalConversion";
import { PartOfReport } from "../getAutomatePart";
export class Emotional extends PartOfReport{
    name : string = "Emotional"
    tests : string[] = ["BDI-II","BDI-IIlist", "BAI", "BAIlist1", "BAIlist2", "BAIlist3"]
    arraySkip: number[]= [2,6]
    textID: string="6298d9e3eabc345e1a4b3ab3"
}