import * as express  from "express";
import * as fs from "fs"
import { ObjectId } from "mongodb";
import { collections } from "../services/database.service";
import { FilledQuestionare, FilledTests, Questionare } from "../database/DBclasses";
import { PartOfReport } from "../services/report/getAutomatePart";
import { Attention } from "../services/report/parts/Attention";
import { CognitiveSymptoms } from "../services/report/parts/CognitiveSymptoms";
import { Emotional } from "../services/report/parts/Emotional";
import { FrontalSystems } from "../services/report/parts/FrontalSystems";
import { GeneralIntelligence } from "../services/report/parts/GeneralInteligence";
import { Learning } from "../services/report/parts/Learning";
import { Motoring } from "../services/report/parts/Motoring";
import { Opening } from "../services/report/parts/Opening";
import { Speech } from "../services/report/parts/Speech";
import { Visual } from "../services/report/parts/Visual";
import { PsychologicalSymptoms } from "../services/report/parts/PsychologicalSymptoms";
import { PhysicalSymptoms } from "../services/report/parts/PhysicalSymptoms";
import { ListTests } from "../services/report/parts/ListTests";
import { asBlob } from "html-docx-js-typescript"
import { Table } from "../services/report/parts/Table";

export const router = express.Router();

router.use(express.json());

const getRank = (name:string,res:number)=>{
    if(name === "BDI-II"){
        if(res <=13){
            return "Minimal"
        } else if ( res <= 19){
            return "Mild"
        } else if ( res <= 28){
            return "Moderate"
        }
        return "Severe"
    } else if (name === "BAI"){
        if(res <=9){
            return "Minimal"
        } else if ( res <= 16){
            return "Mild"
        } else if ( res <= 29){
            return "Moderate"
        }
        return "Severe"
    }
    return "Normal"
}

const returnQuestionareAsResults=async (id : string, name:string) =>{
    const resultsQ:any[] = []
    const queryQuestionare= {_id: new ObjectId(id)}
    const questionare = (await collections.filled.findOne(queryQuestionare)) as unknown as FilledQuestionare;
    if ( ! questionare) {
        return;
    }
    let res = 0
    const sym :string[][] = [[],[],[],[],[],[],[],[],[],[],[]]
    for ( let i=0;i<questionare.answers.length;i++){
        const ans = parseInt(questionare.answers[i],10)
        res+=ans
        let question = questionare.questions[i].toLowerCase()
        if(question.indexOf((i+1).toString()+".") > -1){
            question = question.split(".")[1].trim()
        }
        sym[ans].push(question)
    }
    resultsQ.push({
        "name":name,
        "score":[res],
        "precentage":[0],
        "raiting":getRank(name,res)
    })
    for (let i=0;i<11;i++){
        if(sym[i].length > 0){
        resultsQ.push({
            "name":name+"list"+(i+1).toString(),
            "score":[0],
            "precentage":[0],
            "raiting":sym[i].join(", ")
        })}
    }
    return [resultsQ, new Date(questionare.timestamp)]
}

const partsTest : PartOfReport[] = [new Attention(), new FrontalSystems(), new GeneralIntelligence(), new Learning(),
                                new Motoring(), new Opening(), new Speech(), new Visual(), new ListTests(), new Table()]

const partsQuestionare : PartOfReport[] = [new CognitiveSymptoms(), new PsychologicalSymptoms(), new PhysicalSymptoms(), new Emotional()]

export const produceReportConnect = ( app: express.Application ) => {
    for( const part of partsTest){
        part.Constructor()
    }
    for( const part of partsQuestionare){
        part.Constructor()
    }

    router.post("/", async (req: express.Request, res: express.Response) => {
        const bai = req?.body?.bai;
        const bdi = req?.body?.bdi;
        const cognitive = req?.body?.cognitive;
        const name = req?.body?.name;
        const psychological = req?.body?.psychological;
        const physical = req?.body?.physical;
        let hashUser=""
        const resultsids = req?.body?.resultsids as string[];
        const textParts :string[] = []
        let gender = false
        let resultsQ :object[] = []
        const dateString = ""
        let minDate:Date
        let maxDate:Date
        try{
            for(const resultsid of resultsids){
                const query = {  _id: new ObjectId(resultsid) };
                const filled = (await collections.filledTests.findOne(query)) as unknown as FilledTests ;
                if ( ! filled) {
                    res.status(404).send("")
                    return;
                }
                for( const i of filled.results){
                    const test = i as any
                    if(test.name === "ACT" || test.name.indexOf("RAVLT") > -1){
                        if (test.result.length !== 1 || test.result[0] !== -2){
                            filled.results = filled.results.filter(data => (data as any).name !== 'ACT');
                            test.score = test.result
                            filled.results.push(test)
                        }
                    }
                }
                hashUser = filled.hash
                resultsQ = filled.results.concat(resultsQ);
                gender = filled.gender;
                const date = new Date(filled.timestamp)
                if(minDate === undefined){
                    minDate = date
                    maxDate = date
                } else {
                    if( minDate > date){
                        minDate = date
                    }
                    if (maxDate < date){
                        maxDate = date
                    }
                }
            }
            await Promise.all([(returnQuestionareAsResults(bdi,"BDI-II")).then((data: any)=>{
                resultsQ = resultsQ.concat(data[0]);
                const date = data[1]
                if(minDate === undefined){
                    minDate = date
                    maxDate = date
                } else {
                    if( minDate > date){
                        minDate = date
                    }
                    if (maxDate < date){
                        maxDate = date
                    }
                }}),
            (returnQuestionareAsResults(bai,"BAI")).then((data: any)=>{
                resultsQ = resultsQ.concat(data[0]);
                const date = data[1]
                if( minDate > date){
                    minDate = date
                }
                if (maxDate < date){
                    maxDate = date
                }}),
            (returnQuestionareAsResults(cognitive,"Cognitive")).then((data: any)=>{
                resultsQ = resultsQ.concat(data[0]);
                const date = data[1]
                if( minDate > date){
                    minDate = date
                }
                if (maxDate < date){
                    maxDate = date
                }}),
            (returnQuestionareAsResults(psychological,"Psychological")).then((data: any)=>{
                resultsQ = resultsQ.concat(data[0]);
                const date = data[1]
                if( minDate > date){
                    minDate = date
                }
                if (maxDate < date){
                    maxDate = date
                }}),
            (returnQuestionareAsResults(physical,"Physical")).then((data: any)=>{
                resultsQ = resultsQ.concat(data[0]);
                const date = data[1]
                if( minDate > date){
                    minDate = date
                }
                if (maxDate < date){
                    maxDate = date
                }})]);
            try{
                for(const partNow of partsQuestionare){
                    textParts.push(partNow.getFilledText(name, gender, resultsQ))
                }
                for( const partNow of partsTest){
                    textParts.push(partNow.getFilledText(name, gender, resultsQ))
                }
            } catch(e){
                // tslint:disable-next-line:no-console
                console.log(e);
            }
            res.status(200).send({
                "par":textParts,
                "hash":hashUser,
                "time":minDate.toString().split("T")[0]+"-"+maxDate.toString().split("T")[0]
            });
        } catch (error) {
            res.status(404).send(error.message);
        }

    });
    router.get("/:part", async (req: express.Request, res: express.Response) => {
        const part = req?.params?.part
        const bai = req?.body?.bai;
        const bdi = req?.body?.bdi;
        const cognitive = req?.body?.cognitive;
        const name = req?.body?.name;
        const psychological = req?.body?.psychological;
        const physical = req?.body?.physical;
        const resultsid = req?.body?.resultsid;
        try {
            const query = {  _id: new ObjectId(resultsid) };
            const filled = (await collections.filledTests.findOne(query)) as unknown as FilledTests ;
            if ( ! filled) {
                res.status(404).send("")
                return;
            }
            for(const partNow of partsQuestionare){
                if(partNow.name === part){
                    try {
                        let resultsQ:any[] = []
                        switch(part){
                            case "Emotional":
                                resultsQ = resultsQ.concat((await returnQuestionareAsResults(bdi,"BDI-II")))
                                resultsQ = resultsQ.concat((await returnQuestionareAsResults(bai,"BAI")))
                                break;
                            case "CognitiveSymptoms":
                                resultsQ = resultsQ.concat((await returnQuestionareAsResults(cognitive,"Cognitive")))
                                break;
                            case "PsychologicalSymptoms":
                                resultsQ = resultsQ.concat((await returnQuestionareAsResults(psychological,"Psychological")))
                                break;
                            case "PhysicalSymptoms":
                                resultsQ = resultsQ.concat((await returnQuestionareAsResults(physical,"Physical")))
                                break;
                        }
                        const ss = partNow.getFilledText(name, filled.gender, resultsQ);
                        res.status(200).send(ss);
                        return;
                    }
                    catch(ex) {
                        res.status(404).send(ex.message);
                        return;
                    }
                }
            }
            for( const partNow of partsTest){
                if(partNow.name === part){
                    try {
                        const ss = partNow.getFilledText(name, filled.gender, filled.results);
                        res.status(200).send(ss);
                        return;
                    }
                    catch(ex) {
                        res.status(404).send(ex.message);
                        return;
                    }
                }
            }
            res.status(200).send("Not Found Part")
        } catch (error) {
            res.status(404).send(error.message);
        }
    });

    router.post("/save", async (req: express.Request, res: express.Response) => {
        const parts= req?.body?.html

        const blob = await asBlob(parts)
        res.status(200).send(blob)
    });

    router.post("/example", async (req: express.Request, res: express.Response) => {
        const filePath = `./tmp/example.docx`;
        res.download(filePath);
    });

    app.use('/report', router)
}