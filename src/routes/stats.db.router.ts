import * as express  from "express";
import { ObjectId } from "mongodb";
import { collections } from "../services/database.service";
import {Stats} from "../database/DBclasses";

export const router = express.Router();

router.use(express.json());

export const statsDBConnect = ( app: express.Application ) => {
    router.get("/", async (_req: express.Request, res: express.Response) => {
        try {
            const stat = (await collections.stat.find({}).toArray()) as unknown as Stats[];
            res.status(200).send(stat);
        } catch (error) {
            res.status(500).send(error.message);
        }
    });

    router.get("/:id", async (req: express.Request, res: express.Response) => {
        const id = req?.params?.id;
        try {
            const query = { _id: new ObjectId(id) };
            const stat =  (await collections.stat.findOne(query)) as unknown as Stats;
            if (stat) {
                res.status(200).send(stat);
            } else {
                res.status(404).send("Error")
            }
        } catch (error) {
            res.status(404).send(`Unable to find matching document with id: ${req.params.id}`);
        }
    });

    router.post("/", async (req: express.Request, res: express.Response) => {
        try {
            const stat = req.body as Stats;
            const result = await collections.stat.insertOne(stat);

            result
                ? res.status(201).send(`Successfully created a new stat questionare with id ${result.insertedId}`)
                : res.status(500).send("Failed to create a new stat questionare.");
        } catch (error) {
            res.status(400).send(error.message);
        }
    });

    router.put("/:id", async (req: express.Request, res: express.Response) => {
        const id = req?.params?.id;
        try {
            const updatePart =  req.body as object
            const query = { _id: new ObjectId(id) };
            const stat =  (await collections.stat.findOne(query)) as unknown as Stats;
            if (!stat) {
                res.status(404).send("")
            }
            stat.data = {...stat.data, ...updatePart}
            const result = await collections.stat.updateOne(query, { $set: stat });
            result
                ? res.status(200).send(`Successfully updated q uestionare with id ${id}`)
                : res.status(304).send(`Stat questionare with id: ${id} not updated`);
        } catch (error) {
            // tslint:disable-next-line:no-console
            console.error(error.message);
            res.status(400).send(error.message);
        }
    });

    app.use('/statdb', router)
}