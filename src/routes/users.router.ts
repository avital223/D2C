import * as express  from "express";
import { ObjectId } from "mongodb";
import { collections } from "../services/database.service";
import {Users} from "../database/DBclasses";

export const router = express.Router();

router.use(express.json());

export const usersConnect = ( app: express.Application ) => {
    router.get("/", async (_req: express.Request, res: express.Response) => {
        try {
            const usr = (await collections.user.find({}).toArray()) as unknown as Users[];
            res.status(200).send(usr);
        } catch (error) {
            res.status(500).send(error.message);
        }
    });

    router.get("/:id", async (req: express.Request, res: express.Response) => {
        const id = req?.params?.id;
        try {
            const query = { _id: new ObjectId(id) };
            const usr =  (await collections.user.findOne(query)) as unknown as Users;
            if (usr) {
                res.status(200).send(usr);
            } else {
                res.status(200).send("")
            }
        } catch (error) {
            res.status(200).send("");
        }
    });

    router.get("/mine/:email", async (req: express.Request, res: express.Response) => {
        const email = req?.params?.email;
        try {
            const query = { email };
            const usr =  (await collections.user.find(query).toArray()) as unknown as Users[];
            if (usr) {
                res.status(200).send(usr);
            } else {
                res.status(404).send("Error")
            }
        } catch (error) {
            res.status(404).send(`Unable to find matching document with id: ${req.params.id}`);
        }
    });

    router.post("/", async (req: express.Request, res: express.Response) => {
        try {
            const dobstr = req.body.dob
            req.body.dob = new Date(dobstr)
            const usr = req.body as Users;
            const result = await collections.user.insertOne(usr);

            result
                ? res.status(201).send(`${result.insertedId}`)
                : res.status(500).send("Failed to create a new usr user.");
        } catch (error) {
            res.status(400).send(error.message);
        }
    });

    router.delete("/:id", async (req: express.Request, res: express.Response) => {
        const id = req?.params?.id;

        try {
            const query = { _id: new ObjectId(id) };
            const result = await collections.user.deleteOne(query);

            if (result && result.deletedCount) {
                res.status(202).send(`Successfully removed user with id ${id}`);
            } else if (!result) {
                res.status(400).send(`Failed to remove user with id ${id}`);
            } else if (!result.deletedCount) {
                res.status(404).send(`user with id ${id} does not exist`);
            }
        } catch (error) {
            // tslint:disable-next-line:no-console
            console.error(error.message);
            res.status(400).send(error.message);
        }
    });

    app.use('/users', router)
}