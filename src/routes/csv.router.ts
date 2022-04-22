import * as express  from "express";
import { ObjectId } from "mongodb";
import { collections } from "../services/database.service";
import Csv from "../database/csvDB";
import { appendFile } from "fs";

export const router = express.Router();

router.use(express.json());

const ap= express()

export const csvConnect = ( app: express.Application ) => {
    router.get("/", async (_req: express.Request, res: express.Response) => {
        try {
            const questionare = (await collections.questoinare.find({}).toArray()) as unknown as Csv[];
            res.status(200).send(questionare);
        } catch (error) {
            res.status(500).send(error.message);
        }
    });

    router.get("/:id", async (req: express.Request, res: express.Response) => {
        const id = req?.params?.id;
        try {
            const query = { _id: new ObjectId(id) };
            const questionare = (await collections.questoinare.findOne(query)) as unknown as Csv;

            if (questionare) {
                res.status(200).send(questionare);
            }
        } catch (error) {
            res.status(404).send(`Unable to find matching document with id: ${req.params.id}`);
        }
    });

    router.post("/", async (req: express.Request, res: express.Response) => {
        try {
            const newGame = req.body as Csv;
            const result = await collections.questoinare.insertOne(newGame);

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
            const updatedGame: Csv = req.body as Csv;
            const query = { _id: new ObjectId(id) };

            const result = await collections.questoinare.updateOne(query, { $set: updatedGame });

            result
                ? res.status(200).send(`Successfully updated questionare with id ${id}`)
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
                res.status(202).send(`Successfully removed game with id ${id}`);
            } else if (!result) {
                res.status(400).send(`Failed to remove game with id ${id}`);
            } else if (!result.deletedCount) {
                res.status(404).send(`Game with id ${id} does not exist`);
            }
        } catch (error) {
            // tslint:disable-next-line:no-console
            console.error(error.message);
            res.status(400).send(error.message);
        }
    });

    app.use(express.urlencoded({extended : false}))
    // app.use('/db', router)
}

router.post("/adCSV", (req, res) => {
    res.send("add csv")
})

router.get("/adCSV", (req, res) => {
    res.send("good")
})

