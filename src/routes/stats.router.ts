import * as express  from "express";
import {MMSE} from "../services/statistical/tests/MMSE"
import {ACT} from "../services/statistical/tests/ACT"
import {Hooper} from "../services/statistical/tests/Hooper"
import {SCT} from "../services/statistical/tests/SCT"
import {Booklet} from "../services/statistical/tests/Booklet"
import {allWAIS5, fullIQ} from "../services/statistical/tests/WAIS5"
import {allWMS4} from "../services/statistical/tests/WMS4"
import {StroopColor, StroopWords, StroopColorWords} from "../services/statistical/tests/Stroop"
import {RFFTSD, RFFTER} from "../services/statistical/tests/RFFT"
import {allRAVLT} from "../services/statistical/tests/RAVLT"
import {ROCFDR,ROCFIR,ROCFRec, ROCFCopy} from "../services/statistical/tests/ROCF"
import {TrialsA, TrialsB, FAS, Animals, BNT} from "../services/statistical/tests/Mitrushina"
import {DCT, BTest, TOMM } from "../services/statistical/tests/EffortTests"
import { TONI4 } from "../services/statistical/tests/TONI4";
export const router = express.Router();

router.use(express.json());

export const statConnect = (app: express.Application ) => {
    const statisticalTesting = [new MMSE(), new StroopColor(), new StroopWords(), new StroopColorWords(), new ACT(), new Hooper(), new Booklet(), new SCT(), new RFFTER()
    , new RFFTSD(), new ROCFDR(),new ROCFIR(), new ROCFRec(), new ROCFCopy(), new TrialsA(), new TrialsB(), new FAS(), new Animals(), new BNT(), new DCT(), new BTest(),
     new TOMM(), new TONI4()]
    statisticalTesting.push(...allWMS4)
    statisticalTesting.push(...allRAVLT)
    for( const statTest of statisticalTesting){
        statTest.Constructor()
    }
    // A spetial case due to recursive construction
    fullIQ.Constructor()
    statisticalTesting.push(...allWAIS5)
    router.post("/:name", async (req: express.Request, res: express.Response) => {
        const name = req?.params?.name;
        const age = req?.body?.age;
        const gender = req?.body?.gender;
        const education = req?.body?.education;
        const result = req?.body?.result;
        for( const statTest of statisticalTesting){
            if(statTest.name === name){
                try {
                    const ss = statTest.getValidResult(age,gender,education,result) as number[];
                    const precentage = statTest.getPrecentage(ss) as number[]
                    const json = {
                        "res":ss,
                        "precentage":precentage,
                        "raiting": statTest.getPrecentageToTest(precentage)
                    }
                    res.status(200).send(json);
                    return;
                }
                catch(ex) {
                    res.status(404).send("Something went wrong!");
                    return;
                }
            }
        }
        res.status(404).send("Not Found");
    });

    app.use('/stat', router)
}