import * as express  from "express";
import { ObjectId } from "mongodb";
import { collections } from "../services/database.service";

import {Questionare} from "../database/DBclasses";

export const router = express.Router();

router.use(express.json());

export const questionareConnect = ( app: express.Application ) => {
    router.get("/", async (_req: express.Request, res: express.Response) => {
        try {
            const questionare = (await collections.questoinare.find({}).toArray()) as unknown as Questionare[];
            res.status(200).send(questionare);
        } catch (error) {
            res.status(500).send(error.message);
        }
    });

    router.get("/:id", async (req: express.Request, res: express.Response) => {
        const id = req?.params?.id;
        try {
            const query = { _id: new ObjectId(id) };
            const questionare = (await collections.questoinare.findOne(query)) as unknown as Questionare;

            if (questionare) {
                res.status(200).send(questionare);
            }
        } catch (error) {
            res.status(404).send(`Unable to find matching document with id: ${req.params.id}`);
        }
    });

    router.post("/", async (req: express.Request, res: express.Response) => {
        try {
            const newQuestionare = req.body as Questionare;
            const result = await collections.questoinare.insertOne(newQuestionare);

            result
                ? res.status(201).send(`Successfully created a new questionare with id ${result.insertedId}`)
                : res.status(500).send("Failed to create a new questionare.");
        } catch (error) {
            // tslint:disable-next-line:no-console
            console.error(error);
            res.status(400).send(error.message);
        }
    });

    router.put("/:id", async (req: express.Request, res: express.Response) => {
        const id = req?.params?.id;

        try {
            const updateQuestionare: Questionare = req.body as Questionare;
            const query = { _id: new ObjectId(id) };

            const result = await collections.questoinare.updateOne(query, { $set: updateQuestionare });

            result
                ? res.status(200).send(`Successfully updated game with id ${id}`)
                : res.status(304).send(`Questionare with id: ${id} not updated`);
        } catch (error) {
            // tslint:disable-next-line:no-console
            console.error(error.message);
            res.status(400).send(error.message);
        }
    });

    router.delete("/:id", async (req: express.Request, res: express.Response) => {
        const id = req?.params?.id;

        try {
            const query = { _id: new ObjectId(id) };
            const result = await collections.questoinare.deleteOne(query);

            if (result && result.deletedCount) {
                res.status(202).send(`Successfully removed questionare with id ${id}`);
            } else if (!result) {
                res.status(400).send(`Failed to remove questionare with id ${id}`);
            } else if (!result.deletedCount) {
                res.status(404).send(`Questionare with id ${id} does not exist`);
            }
        } catch (error) {
            // tslint:disable-next-line:no-console
            console.error(error.message);
            res.status(400).send(error.message);
        }
    });

    app.use('/db', router)
}