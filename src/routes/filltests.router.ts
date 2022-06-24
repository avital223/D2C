import * as express  from "express";
import { collections } from "../services/database.service";
import {FilledTests, Users} from "../database/DBclasses";
import { namingDic } from "../services/statistical/statisticalNaming";
import fetch from "node-fetch";
import * as formidable from "formidable";
import * as xlsx from "xlsx";
import * as fs from "fs";
import { ObjectId } from "mongodb";
import { nextTick } from "process";
export const router = express.Router();


const convertToNum = (i : string) =>{
    if(i.indexOf("=")>-1){
        i = i.split("=")[1]
    }
    const newStr = i.split("th")[0].split("nd")[0].split("st")[0].split("rd")[0].trim()
    if(i.indexOf("<")>-1){
        return "<"+newStr.split("<")[1]
    } if(i.indexOf(">")>-1){
        return ">"+newStr.split(">")[1]
    }
    if(i.indexOf("-") > -1){
        return newStr
    }
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
            const hash = fields?.hash as string;
            const fileupload = files?.csvUpload as formidable.File;
            let age;
            let gender :boolean
            let education;
            try {
                const query = { _id: new ObjectId(hash) };
                const usr =  (await collections.user.findOne(query)) as unknown as Users;
                if (usr) {
                    const dob = new Date(usr.dob).getTime()
                    const ageDate = new Date(new Date().getTime()-dob);
                    age = (Math.abs(ageDate.getUTCFullYear() - 1970)).toString()
                    gender = usr.gender
                    education = usr.education
                } else {
                    res.status(200).send("Not a valid hash user!");
                    return;
                }
            } catch (error) {
                res.status(200).send("Not a valid hash user!");
                return;
            }
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

            fs.unlinkSync(fileupload.filepath);
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
                            if( namingDic[nameTest].indexOf("VSVT") === 0){
                                score = [item["Score & %ile"].trim()]
                                precentage = [item["Score & %ile"].trim()]
                            } else if ( namingDic[nameTest] === "ACT"){
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
            res.status(200).send("Added a new Testing Results to the spesified hash patient!")
        });
    });

    router.get("/:hash", async (req: express.Request, res: express.Response) => {
        const hash = req?.params?.hash;
        try {
            const query = { hash};
            const filled = (await collections.filledTests.find(query).toArray()) as unknown as FilledTests[];
            if (filled) {
                res.status(200).send(filled);
            } else {
                res.status(404).send("lala")
            }
        } catch (error) {
            res.status(404).send(`Unable to find matching document with hash: ${req.params.hash}`);
        }
    });

    app.use('/fillTests', router)
}
