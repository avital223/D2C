import * as express  from "express";
import { ObjectId, Timestamp } from "mongodb";
import { collections } from "../services/database.service";
import { FilledTests } from "../database/DBclasses";
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
export const router = express.Router();

router.use(express.json());

const parts : PartOfReport[] = [new Attention(), new CognitiveSymptoms(), new Emotional(), new FrontalSystems(), new GeneralIntelligence(), new Learning(),
                                new Motoring(), new Opening(), new Speech(), new Visual()]
export const produceReportConnect = ( app: express.Application ) => {
    for( const part of parts){
        part.Constructor()
    }
    router.get("/:part", async (req: express.Request, res: express.Response) => {
        const part = req?.params?.part
        const bai = req?.body?.bai;
        const bdi = req?.body?.bdi;
        const name = req?.body?.name;
        const resultsid = req?.body?.resultsid;
        try {
            const query = {  _id: new ObjectId(resultsid) };
            const filled = (await collections.filledTests.findOne(query)) as unknown as FilledTests ;
            if ( ! filled) {
                res.status(404).send("")
                return;
            }
            for( const partNow of parts){
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

    app.use('/report', router)
}