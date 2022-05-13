import * as express  from "express";
import {MMSE} from "../services/statistical/tests/MMSE"
import {ACT} from "../services/statistical/tests/ACT"
import {Hooper} from "../services/statistical/tests/Hooper"
import {SCT} from "../services/statistical/tests/SCT"
import {Booklet} from "../services/statistical/tests/Booklet"
import {allWAIS5, fullIQ} from "../services/statistical/tests/WAIS5"
import {allWMS4} from "../services/statistical/tests/WMS4"
import {StroopColor, StroopWords, StroopClolorWords} from "../services/statistical/tests/Stroop"
import {RFFTSD, RFFTER} from "../services/statistical/tests/RFFT"
export const router = express.Router();

router.use(express.json());

export const statConnect = (app: express.Application ) => {
    const statisticalTesting = [new MMSE(), new StroopColor(), new StroopWords(), new StroopClolorWords(), new ACT(), new Hooper(), new Booklet(), new SCT()
    , new RFFTER(), new RFFTSD()]
    statisticalTesting.push(...allWMS4)
    for( const statTest of statisticalTesting){
        statTest.Constructor()
    }
    // A spetial case due to recursive construction
    fullIQ.Constructor()
    statisticalTesting.push(...allWAIS5)
    router.get("/:name", async (req: express.Request, res: express.Response) => {
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
                        "raiting": statTest.getPrecentageToTest(precentage),
                        "norms":statTest.norms,
                        "correction":statTest.getCorrection()
                    }
                    res.status(200).send(json);
                    return;
                }
                catch(ex) {
                    res.status(200).send("Something went wrong!");
                    return;
                }
            }
        }
        res.status(200).send("Not Found");
    });

    app.use('/stat', router)
}