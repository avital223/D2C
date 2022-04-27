import * as express  from "express";
import { ObjectId } from "mongodb";
import { collections } from "../services/database.service";
import {FilledQuestionare} from "../database/DBclasses";

export const router = express.Router();

router.use(express.json());

export const filledQuestionareConnect = ( app: express.Application ) => {
    router.get("/", async (_req: express.Request, res: express.Response) => {
        try {
            const filled = (await collections.filled.find({}).toArray()) as unknown as FilledQuestionare[];
            res.status(200).send(filled);
        } catch (error) {
            res.status(500).send(error.message);
        }
    });

    router.get("/:email", async (req: express.Request, res: express.Response) => {
        const email = req?.params?.email;
        try {
            const query = { email};
            const filled = (await collections.filled.find(query).toArray()) as unknown as FilledQuestionare[];
            if (filled) {
                res.status(200).send(filled);
            } else {
                res.status(404).send("")
            }
        } catch (error) {
            res.status(404).send(`Unable to find matching document with email: ${req.params.email}`);
        }
    });

    router.get("/:email/:id", async (req: express.Request, res: express.Response) => {
        const email = req?.params?.email;
        const id = req?.params?.id;
        try {
            const query = { email, questionareId : id };
            const filled = (await collections.filled.findOne(query)) as unknown as FilledQuestionare;
            if (filled) {
                res.status(200).send(filled);
            } else {
                res.status(404).send("")
            }
        } catch (error) {
            res.status(404).send(`Unable to find matching document with email: ${req.params.email}`);
        }
    });

    router.post("/", async (req: express.Request, res: express.Response) => {
        try {
            const newFilled = req.body as FilledQuestionare;
            const result = await collections.filled.insertOne(newFilled);

            result
                ? res.status(201).send(`Successfully created a new filled questionare with id ${result.insertedId}`)
                : res.status(500).send("Failed to create a new filled questionare.");
        } catch (error) {
            // tslint:disable-next-line:no-console
            console.error(error);
            res.status(400).send(error.message);
        }
    });

    router.put("/:id", async (req: express.Request, res: express.Response) => {
        const id = req?.params?.id;

        try {
            const updatedFilled: FilledQuestionare = req.body as FilledQuestionare;
            const query = { _id: new ObjectId(id) };

            const result = await collections.filled.updateOne(query, { $set: updatedFilled });

            result
                ? res.status(200).send(`Successfully updated q uestionare with id ${id}`)
                : res.status(304).send(`Filled questionare with id: ${id} not updated`);
        } catch (error) {
            // tslint:disable-next-line:no-console
            console.error(error.message);
            res.status(400).send(error.message);
        }
    });

    router.delete("/:questionareId", async (req: express.Request, res: express.Response) => {
        const questionareId = req?.params?.questionareId;

        try {
            const query = { questionareId };
            const result = await collections.filled.deleteMany(query);

            if (result && result.deletedCount) {
                res.status(202).send(`Successfully removed filled questionare with id ${questionareId}`);
            } else if (!result) {
                res.status(400).send(`Failed to remove filled questionare with id ${questionareId}`);
            } else if (!result.deletedCount) {
                res.status(404).send(`filled questionare with id ${questionareId} does not exist`);
            }
        } catch (error) {
            // tslint:disable-next-line:no-console
            console.error(error.message);
            res.status(400).send(error.message);
        }
    });

    app.use('/filled', router)
}