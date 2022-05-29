import * as express  from "express";
import { collections } from "../services/database.service";
import {FilledTests} from "../database/DBclasses";
import fetch from "node-fetch";
import * as formidable from "formidable";
import * as xlsx from "xlsx";
export const router = express.Router();


const namingDic : any = {
	"MMSE": "MMSE",
	"Similarities": "WAIS5SI",
	"Information": "WAIS5IN",
	"Block Design": "WAIS5BD",
	"Matrix Reasoning": "WAIS5MR",
	"Visual Puzzles": "WAIS5VP",
	"Digit Span": "WAIS5DS",
	"Arithmetic": "WAIS5AR",
	"Symbol Search": "WAIS5SS",
	"Vocabulary": "WAIS5VC",
	"Comprehension": "WAIS5CO",
	"Cancellation": "WAIS5CA",
	"Picture Completion": "WAIS5PCm",
	"Letter Numbering": "WAIS5LN",
	"Figure Weights": "WAIS5FW",
	"Coding": "WAIS5CD",
	"Verbal Comprehension Index": "WAIS5VCI",
	"Perceptual Reasoning Index": "WAIS5PRI",
	"Working Memory Index": "WAIS5WMI",
	"Processing Speed Index": "WAIS5PSI",
	"Full Scale IQ": "WAIS5FSIQ",
	"Test of Nonverbal Intelligence-4": "TONI4",
	"Trails A": "TrialsA",
	"Stroop Word (Golden)": "StroopWords",
	"Stroop Color (Golden)": "StroopColor",
	"Connors CPT3 Response Style": "CPT3RS",
	"Connors CPT3 d' *": "CPT3D",
	"Connors CPT3 Omissions *": "CPT3OM",
	"Connors CPT3 Commissions *": "CPT3CO",
	"Connors CPT3 Perseverations *": "CPT3PE",
	"Connors CPT3 HRT **": "CPT3HRT",
	"Connors CPT3 HRT SD *": "CPT3HRTS",
	"Connors CPT3 Variability *": "CPT3VI",
	"Connors CPT3 HRT Block Change*": "CPT3BC",
	"Connors CPT3 HRT ISI Change*": "CPT3ISICS",
	"Hooper Visual Organization Test": "Hooper",
	"Rey-O Copy": "ROCFCopy",
	"Boston Naming Test": "BNT",
	"FAS": "FAS",
	"Animal Naming": "Aminals",
	"WMS-IV Logical Memory I": "WMS4LM1",
	"WMS-IV Logical Memory II": "WMS4LM2",
	"WMS-IV Log. Mem. Recog.": "WMS4LMRec",
	"RAVLT-trial 1": "RAVLTT1",
	"RAVLT-trial 2": "RAVLTT2",
	"RAVLT-trial 3": "RAVLTT3",
	"RAVLT-trial 4": "RAVLTT4",
	"RAVLT-trial 5": "RAVLTT5",
	"RAVLT-trials 1-5": "RAVLTT1to5",
	"RAVLT-list B": "RAVLTTB",
	"RAVLT-short delay recall": "RAVLTShortDelay",
	"RAVLT-long delay recall": "RAVLTLongDelay",
	"RAVLT-recognition": "RAVLTRec",
	"WMS-IV Visual Repro. I": "WMS4VR1",
	"WMS-IV Visual Repro. II": "WMS4VR2",
	"WMS-IV Vis. Rep. Recog.": "WMS4VRRec",
	"Rey-O-immediate": "ROCFIR",
	"Rey-O-delayed": "ROCFDR",
	"Rey-O-recognition": "ROCFRec",
	"WCST Categories Completed": "WCSTCC",
	"WCST Trials to 1st Category": "WCSTTC",
	"WCST Total Errors": "WCSTTE",
	"WCST Perseverative Errors": "WCSTPE",
	"WCST Nonperseverative Errors": "WCSTNE",
	"WCST % Conceptual Responses": "WCSTCR",
	"WCST Learning to Learn": "WCSTLL",
	"WCST Set Losses": "WCSTST",
	"Ruff Figural Fluency Total Designs": "RFFTSD",
	"Ruff Figural Fluency Error Ratio": "RFFTER",
	"Trails B": "TrialsB",
	"Stroop Color-Word (Golden)": "StroopColorWords",
	"The Dot Counting Test": "DCT",
	"B-Test": "BTest",
    "ACT (9\", 18\", 36\")":"ACT",
    "TOMM Trials 1, 2":"TOMM",
    "Booklet Category Test":"Booklet",
    "Short Category Test":"SCT"
}

const convertToNum = (i : string) =>{
    if(i.indexOf("=")>-1){
        i = i.split("=")[1]
    }
    if(i.indexOf("<")>-1){
        i = i.split("<")[1]
    }
    const newStr = i.split("th")[0].split("nd")[0].split("st")[0].split("rd")[0].trim()
    try{
        return parseInt(newStr,10)
    } catch {
        return newStr
    }
}

export const filledTests = (app: express.Application ) => {
    router.post("/", async (req: express.Request, res: express.Response) => {
        const hash = req?.body?.hash;
        const age = req?.body?.age;
        const gender = req?.body?.gender;
        const education = req?.body?.education;
        const results = req?.body?.results;
        let hasError = false
        const arrayTests: { name: string; result?: number[]; score?: number[]; precentage?: number[]; raiting?: string; }[] = []
        for( const result of results){
            const data = {
                "age":age,
                "gender":gender,
                "education":education,
                "result":result.result
            }
            const resFetch = await fetch(process.env.HOST_URL+"/stat/"+result.name, {
                method: 'POST',
                headers:{
                    'Content-Type':'application/json'
                },
                body: JSON.stringify(data),
            }).then(response => response.json())
            .catch((err)=>{
                // tslint:disable-next-line:no-console
                console.error(err);
                hasError = true
            })
            const test = {
                "name": result.name,
                "result":result.result,
                "score":[0],
                "precentage":[0],
                "raiting":""
            }
            if(resFetch !== "Not Found" && !hasError){
                test.score = resFetch?.res;
                test.precentage = resFetch?.precentage;
                test.raiting = resFetch?.raiting;
            } else{
                test.score = result.result;
                test.precentage = result.result;
                test.raiting = result.result;
            }
            arrayTests.push(test)
            hasError = false
        }
        const testingUser = {
            "hash": hash,
            "age":age,
            "gender":gender,
            "education":education,
            "results":arrayTests,
            "timestamp": new Date()
        }
        try {
            const testFilled = testingUser as unknown as FilledTests;
            const resultInsert = await collections.filledTests.insertOne(testFilled);

            resultInsert
                ? res.status(201).send(`Successfully created a new testing with id ${resultInsert.insertedId}`)
                : res.status(500).send("Failed to create a new tesing results.");
        } catch (error) {
            // tslint:disable-next-line:no-console
            console.error(error);
            res.status(400).send(error.message);
        }
    });

    router.post("/xlsx", async (req: express.Request, res: express.Response) => {

        const form = new formidable.IncomingForm({uploadDir : './tmp'});

        form.parse(req, async (err, fields, files) => {
            const hash = fields?.hash;
            const age = parseInt( fields?.age as string,10);
            const genderStr = fields?.gender;
            let gender :boolean
            if(genderStr === "Male"){
                gender = false
            } else {
                gender = true
            }
            const education = parseInt( fields?.education as string,10);
            const fileupload = files?.csvUpload as formidable.File;
            // Reading our test file
            const file = xlsx.readFile(fileupload.filepath)
            const arrayTests: { name: string; result?: number[]; score?: number[]; precentage?: number[]; raiting?: string; }[] = []
            const data: any[] = []

            const sheets = file.SheetNames

            for(let i = 0; i < sheets.length; i++)
            {
                const temp = xlsx.utils.sheet_to_json(
                file.Sheets[file.SheetNames[i]])
                temp.forEach((result) => {
                    data.push(result)
                })
            }
            for (const item of data){
                try{
                    let nameTest = (item["Cognitive Domain/Measure"] as string).trim()
                    for (const key in namingDic){
                        if(nameTest.indexOf(key)> -1){
                            nameTest = key
                            break;
                        }
                    }
                    if (namingDic[nameTest] !== undefined){
                        let score: any[] = []
                        let precentage: any[] = []
                        let rating : string
                        if( namingDic[nameTest].indexOf("CPT3")===0){
                            score = [item["Score & %ile"].trim()]
                            precentage = [item["Score & %ile"].trim()]
                            rating = item["Score & %ile"].trim()
                        } else {
                            rating = item["Performance Rating"].trim()
                            if ( namingDic[nameTest] === "ACT"){
                                const results = item["Score & %ile"].split("=")
                                for (const j of results[0].split(",")){
                                    score.push(parseInt(j.trim(),10))
                                }
                                for (const j of results[1].split(",")){
                                    precentage.push(convertToNum(j))
                                }
                            } else if ( namingDic[nameTest]==="DCT" || namingDic[nameTest]==="RFFTER"){
                                const results = item["Score & %ile"].split(",")
                                if(results[0].indexOf("=")>-1){
                                    results[0] = results[0].split("=")[1]
                                }
                                score.push(parseInt(results[0].replace("\"","").trim(),10))
                            } else {
                                const results = item["Score & %ile"].split(",")
                                if(results[0].indexOf("=")>-1){
                                    results[0] = results[0].split("=")[1]
                                }
                                if(results[0].indexOf("<")>-1){
                                    results[0] = results[0].split("<")[1]
                                }
                                score.push(parseInt(results[0].replace("\"","").trim(),10))
                                precentage.push(convertToNum(results[1]))
                            }
                        }
                        const test = {
                            "name": namingDic[nameTest],
                            "result": [-2], // meaning the score was taken from the excel file
                            "score":score,
                            "precentage":precentage,
                            "raiting": rating
                        }
                        arrayTests.push(test)
                    }
                } catch {
                    // tslint:disable-next-line:no-console
                    console.log(item)
                }
            }
            const testingUser = {
                "hash": hash,
                "age":age,
                "gender":gender,
                "education":education,
                "results":arrayTests,
                "timestamp": new Date()
            }
            try {
                const testFilled = testingUser as unknown as FilledTests;
                const resultInsert = await collections.filledTests.insertOne(testFilled);

                if (!resultInsert ){
                    res.status(500).send("Failed to create a new tesing results.");
                }
            } catch (error) {
                // tslint:disable-next-line:no-console
                console.error(error);
                res.status(400).send(error.message);
            }
        });
        res.redirect("/")
    });

    app.use('/fillTests', router)
}
