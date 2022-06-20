import { PartOfReport } from "../getAutomatePart";
import { namingDic } from "../../statistical/statisticalNaming";
import {MMSE} from "../../statistical/tests/MMSE"
import {ACT} from "../../statistical/tests/ACT"
import {Hooper} from "../../statistical/tests/Hooper"
import {SCT} from "../../statistical/tests/SCT"
import {Booklet} from "../../statistical/tests/Booklet"
import {WAIS5AR, WAIS5FSIQ} from "../../statistical/tests/WAIS5"
import {allWMS4} from "../../statistical/tests/WMS4"
import {StroopColor, StroopWords, StroopColorWords} from "../../statistical/tests/Stroop"
import {RFFTSD, RFFTER} from "../../statistical/tests/RFFT"
import {RAVLTT1} from "../../statistical/tests/RAVLT"
import {ROCFDR,ROCFIR,ROCFRec, ROCFCopy} from "../../statistical/tests/ROCF"
import {TrialsA, TrialsB, FAS, Animals, BNT} from "../../statistical/tests/Mitrushina"
import {DCT, BTest, TOMM } from "../../statistical/tests/EffortTests"

export class Table extends PartOfReport{
    name : string = "Table"
    tests : string[] = []
    public Constructor(): Promise<void> {
        return;
    }

    private getAllWAIS5(results:any[]){
        const arrsub :any[]= []
        const namesSub : string[] = []
        const arrind :any[]= []
        const namesInd : string[] = []
        let FSIQ:any;
        for(const i of results){
            if(i.name.indexOf("WAIS5") === 0){
                const subname = i.name.split("5")[1] as string
                if(subname.length === 2 || subname === "PCm"){
                    if(namesSub.indexOf(i.name) === -1){
                        arrsub.push(i)
                        namesSub.push(i.name)
                    }
                } else if (subname === "FSIQ"){
                    FSIQ = i
                } else {
                    if(namesInd.indexOf(i.name) === -1){
                        arrind.push(i)
                        namesInd.push(i.name)
                    }
                }
            }
        }
        return {
            "sub":arrsub,
            "ind":arrind,
            "fsiq":FSIQ
        }
    }

    private getAllByName(name:string, results:any[]){
        const arr :any[]= []
        for(const i of results){
            if(i.name.indexOf(name) === 0){
                if(this.getNameFromDic(i.name)!==""){
                    arr.push(i)
                }
            }
        }
        return arr
    }
    protected getNameInRes(name:string, results:any[]){
        for(const i of results){
            if(i.name.indexOf(name) === 0){
                return i
            }
        }
        return undefined
    }



    protected getNameFromDic(name:string){
        for(const i in namingDic){
            if(namingDic[i].indexOf(name) === 0){
                return i
            }
        }
        return ""
    }
    public getFilledText(name: string, gender: boolean, results: any[]): string {
        let str = "<tr><td><b>Mental Status</b></td><th></th><th></th><th></th><th></th></tr>"
        try{
            let test = this.getNameInRes("MMSE",results)
            if(test!== undefined){
                str+="<tr><td>MMSE</td><td>"+test.score+", "+test.precentage+"</td><td>"+test.raiting+"</td><td>"+new MMSE().getNorms()+"</td><td>"+new MMSE().getCorrection()+"</td></tr>"
            }
            const WAIS = this.getAllWAIS5(results);
            str+="<tr><td><b>General Intellectual Functioning\nWAIS-IV</b> Subtests/<i>Indices/<b>IQ</b></i></td><th></th><th></th><th></th><th></th></tr>"
            const norm = new WAIS5AR().getNorms()
            const correction = new WAIS5FSIQ().getCorrection()
            for(test of WAIS.sub){
                str+="<tr><td>"+this.getNameFromDic(test.name)+"</td><td>SS="+test.score+", "+test.precentage+"</td><td>"+test.raiting+"</td><td>"+norm+"</td><td>"+correction+"</td></tr>"
            }
            for(test of WAIS.ind){
                str+="<tr><td><i>"+this.getNameFromDic(test.name)+"</i></td><td><i>"+test.score+", "+test.precentage+"</i></td><td><i>"+test.raiting+"</i></td><td><i>"+norm+"</td><td><i>"+correction+"</i></td></tr>"
            }
            test = WAIS.fsiq
            if(test!== undefined){
                str+="<tr><td><i><b>"+this.getNameFromDic(test.name)+"</b><i></td><td><i><b>"+test.score+", "+test.precentage+"</b><i></td><td><i><b>"+test.raiting+"</b><i></td><td><i><b>"+norm+"</b><i></td><td><i><b>"+correction+"</b><i></td></tr>"
            }
            str+="<tr><td><b>Premorbid Intellectual Funct.</b></td><th></th><th></th><th></th><th></th></tr>"
            test = this.getNameInRes("TONI4", results)
            if(test!== undefined){
                str+="<tr><td>"+this.getNameFromDic(test.name)+"</td><td>"+test.score+", "+test.precentage+"</td><td>"+test.raiting+"</td><td>Manual</td><td>A</td></tr>"
            }
            str+="<tr><td><b>Attention/Concentration</b></td><th></th><th></th><th></th><th></th></tr>"
            let arr = ["WAIS5AR", "WAIS5DS","WAIS5CD", "WAIS5SS"]
            for(const i of arr){
                test = this.getNameInRes(i,WAIS.sub)
                if(test!==undefined){
                    str+="<tr><td>WAIS-IV "+this.getNameFromDic(test.name)+"</td><td>SS="+test.score+", "+test.precentage+"</td><td>"+test.raiting+"</td><td>"+norm+"</td><td>"+correction+"</td></tr>"
                }
            }
            let ARR = [new TrialsA(), new StroopWords(), new StroopColor(), new ACT()]
            for(const i of ARR){
                test = this.getNameInRes(i.name,results)
                if(test!==undefined){
                    str+="<tr><td>"+this.getNameFromDic(test.name)+"</td><td>"+test.score+", "+test.precentage+"</td><td>"+test.raiting+"</td><td>"+i.getNorms()+"</td><td>"+i.getCorrection()+"</td></tr>"
                }
            }
            const arrCPT3= this.getAllByName("CPT3",results)
            for(test of arrCPT3){
                str+="<tr><td>"+this.getNameFromDic(test.name)+"</td><td colspan='2'>"+test.score+"</td><td>Manual</td><td>A+G</td></tr>"
            }
            if(arrCPT3.length !== 0){
                str+="<tr><td colspan='5'>*   T-Score guidelines for CPT3 variables (except Response Style and HRT):  70+ Very Elevated, 60-69 Elevated, 55-59 High Average, 45-54 Average, 40-44 Low (with lower T scores representing better performance and higher T scores representing more difficulty)</td></tr>"
                str+="<tr><td colspan='5'>** T-Score guidelines for CPT3 HRT:  70+ Atypically Slow, 60-69 Slow, 55-59 A Little Slow, 45-54 Average, 40-44 A Little Fast, <40 Atypically Fast</td></tr>"
            }
            str+="<tr><td><b>Visuospatial Functioning</b></td><th></th><th></th><th></th><th></th></tr>"
            ARR = [new Hooper(), new ROCFCopy()]
            for( const i of ARR){
                test = this.getNameInRes(i.name,results)
                if(test!==undefined){
                    str+="<tr><td>"+this.getNameFromDic(test.name)+"</td><td>"+test.score+", "+test.precentage+"</td><td>"+test.raiting+"</td><td>"+i.getNorms()+"</td><td>"+i.getCorrection()+"</td></tr>"
                }
            }
            arr=["WAIS5BD", "WAISVPVP"]
            ARR=[ new WAIS5FSIQ(), new WAIS5FSIQ()]
            for( let i=0;i<arr.length;i++){
                test = this.getNameInRes(arr[i],results)
                if(test!==undefined){
                    str+="<tr><td>WAIS-IV "+this.getNameFromDic(test.name)+"</td><td>SS="+test.score+", "+test.precentage+"</td><td>"+test.raiting+"</td><td>"+norm+"</td><td>"+ARR[i].getCorrection()+"</td></tr>"
                }
            }
            str+="<tr><td><b>Speech and Language </b></td><th></th><th></th><th></th><th></th></tr>"
            ARR = [new BNT(), new FAS(), new Animals()]
            for( const i of ARR){
                test = this.getNameInRes(i.name,results)
                if(test!==undefined){
                    str+="<tr><td>"+this.getNameFromDic(test.name)+"</td><td>"+test.score+", "+test.precentage+"</td><td>"+test.raiting+"</td><td>"+i.getNorms()+"</td><td>"+i.getCorrection()+"</td></tr>"
                }
            }
            str+="<tr><td><b>Verbal Memory </b></td><th></th><th></th><th></th><th></th></tr>"
            arr = ["WMS4LM1", "WMS4LM2", "WMS4LMRec"]
            ARR = allWMS4;
            for( let i=0;i<arr.length;i++){
                test = this.getNameInRes(arr[i],results)
                if(test!==undefined){
                    str+="<tr><td>"+this.getNameFromDic(test.name)+"</td><td>"+test.score+", "+test.precentage+"</td><td>"+test.raiting+"</td><td>"+ARR[i].getNorms()+"</td><td>"+ARR[i].getCorrection()+"</td></tr>"
                }
            }
            const arrRAVLT = this.getAllByName("RAVLT",results);
            const r = new RAVLTT1()
            for(test of arrRAVLT){
                str+="<tr><td>"+this.getNameFromDic(test.name)+"</td><td>"+test.score+", "+test.precentage+"</td><td>"+test.raiting+"</td><td>"+r.getNorms()+"</td><td>"+r.getCorrection()+"</td></tr>"
            }
            str+="<tr><td><b>Visual Memory </b></td><th></th><th></th><th></th><th></th></tr>"
            arr = ["WMS4VR1", "WMS4VR2", "WMS4VRRec"]
            ARR = allWMS4;
            for( let i=0;i<arr.length;i++){
                test = this.getNameInRes(arr[i],results)
                if(test!==undefined){
                    str+="<tr><td>"+this.getNameFromDic(test.name)+"</td><td>"+test.score+", "+test.precentage+"</td><td>"+test.raiting+"</td><td>"+ARR[i].getNorms()+"</td><td>"+ARR[i].getCorrection()+"</td></tr>"
                }
            }
            ARR = [new ROCFIR(), new ROCFDR(), new ROCFRec()];
            for( const i of ARR){
                test = this.getNameInRes(i.name,results)
                if(test!==undefined){
                    str+="<tr><td>"+this.getNameFromDic(test.name)+"</td><td>"+test.score+", "+test.precentage+"</td><td>"+test.raiting+"</td><td>"+i.getNorms()+"</td><td>"+i.getCorrection()+"</td></tr>"
                }
            }
            str+="<tr><td><b>Frontal Sys./Exec. Functioning</b></td><th></th><th></th><th></th><th></th></tr>"
            arr= this.getAllByName("WCST",results);
            for(test of arr){
                str+="<tr><td>"+this.getNameFromDic(test.name)+"</td><td>"+test.score+", "+test.precentage+"</td><td>"+test.raiting+"</td><td>Heaton et al (1993)</td><td>A + E</td></tr>"
            }
            ARR = [new RFFTSD(), new RFFTER(), new ROCFRec(), new TrialsB(), new StroopColorWords(), new ACT(), new FAS(), new Animals(),new SCT(),new Booklet()];
            for( const i of ARR){
                test = this.getNameInRes(i.name,results)
                if(test!==undefined){
                    str+="<tr><td>"+this.getNameFromDic(test.name)+"</td><td>"+test.score+", "+test.precentage+"</td><td>"+test.raiting+"</td><td>"+i.getNorms()+"</td><td>"+i.getCorrection()+"</td></tr>"
                }
            }
            arr=["WAIS5SI", "WAIS5MR"]
            ARR = [new WAIS5AR(), new WAIS5AR()];
            for( let i=0;i<arr.length;i++){
                test = this.getNameInRes(arr[i],results)
                if(test!==undefined){
                    str+="<tr><td>WAIS-IV "+this.getNameFromDic(test.name)+"</td><td>SS="+test.score+", "+test.precentage+"</td><td>"+test.raiting+"</td><td>"+norm+"</td><td>"+ARR[i].getCorrection()+"</td></tr>"
                }
            }
            str+="<tr><td><b>Effort and Motivation</b></td><th></th><th></th><th></th><th></th></tr>"
            ARR = [new TOMM(), new DCT(), new BTest()]
            for( const i of ARR){
                test = this.getNameInRes(i.name,results)
                if(test!==undefined){
                    str+="<tr><td>"+this.getNameFromDic(test.name)+"</td><td>"+test.score+", "+test.precentage+"</td><td>"+test.raiting+"</td><td>"+i.getNorms()+"</td><td>"+i.getCorrection()+"</td></tr>"
                }
            }
            arr= this.getAllByName("VSVT",results);
            for(test of arr){
                str+="<tr><td>"+this.getNameFromDic(test.name)+"</td><td>"+test.score+"</td><td>"+test.raiting+"</td><td>Manual</td><td>N/A</td></tr>"
            }
            str+="<tr><td><b>Mood/Personality</b></td><th></th><th></th><th></th><th></th></tr>"
            arr=["BAI", "BDI-II"]
            for( const i of arr){
                test = this.getNameInRes(i,results)
                if(test!==undefined){
                    str+="<tr><td>"+i+"</td><td>"+test.score+"</td><td>"+test.raiting+"</td><td>Manual</td><td>N/A</td></tr>"
                }
            }
            str+="<tr><td colspan='5'><i>Note:  “Performance ratings” are qualitative descriptors derived from the quantitative percentile (%ile) data according to the following transformations:  Extremely Low: <2nd %ile; Borderline: 2nd to 8th %iles; Low Average: 9th to 24th %iles; Average: 25th to 74th %iles; High Average: 75th to 90th %iles; Superior: 91st to 97th %iles; Very Superior: >98th %ile</i></td></tr>"
        } catch(e){
            // tslint:disable-next-line:no-console
            console.log(e)
        }
        return str
    }
}
