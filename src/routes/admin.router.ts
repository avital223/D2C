import * as express  from "express";
import { ObjectId } from "mongodb";
import { collections } from "../services/database.service";
import {Admin} from "../database/DBclasses";

export const adminRouter = express.Router();

adminRouter.use(express.json());

export const admin = ( app: express.Application ) => {
    adminRouter.get("/", async (_req: express.Request, res: express.Response) => {
        try {
            const adminNow = (await collections.admin.find({}).toArray()) as unknown as Admin[];
            res.status(200).send(adminNow);
        } catch (error) {
            res.status(500).send(error.message);
        }
    });

    adminRouter.get("/:id", async (req: express.Request, res: express.Response) => {
        const id = req?.params?.email;
        try {
            const query = { email: id };
            const adminNow = (await collections.admin.findOne(query)) as unknown as Admin;

            if (adminNow) {
                res.status(200).send(adminNow);
            }
        } catch (error) {
            res.status(404).send(`Unable to find matching document with id: ${req.params.id}`);
        }
    });

    adminRouter.post("/", async (req: express.Request, res: express.Response) => {
        try {
            const newAdmin = req.body as Admin;
            const result = await collections.admin.insertOne(newAdmin);

            result
                ? res.status(201).send(`Successfully created a new admin with id ${result.insertedId}`)
                : res.status(500).send("Failed to create a new admin.");
        } catch (error) {
            // tslint:disable-next-line:no-console
            console.error(error);
            res.status(400).send(error.message);
        }
    });

    adminRouter.put("/:id", async (req: express.Request, res: express.Response) => {
        const id = req?.params?.id;

        try {
            const updatedAdmin: Admin = req.body as Admin;
            const query = { _id: new ObjectId(id) };

            const result = await collections.admin.updateOne(query, { $set: updatedAdmin });

            result
                ? res.status(200).send(`Successfully updated q uestionare with id ${id}`)
                : res.status(304).send(`Admin with id: ${id} not updated`);
        } catch (error) {
            // tslint:disable-next-line:no-console
            console.error(error.message);
            res.status(400).send(error.message);
        }
    });

    adminRouter.delete("/:id", async (req: express.Request, res: express.Response) => {
        const id = req?.params?.id;

        try {
            const query = { _id: new ObjectId(id) };
            const result = await collections.admin.deleteOne(query);

            if (result && result.deletedCount) {
                res.status(202).send(`Successfully removed admin with id ${id}`);
            } else if (!result) {
                res.status(400).send(`Failed to remove admin with id ${id}`);
            } else if (!result.deletedCount) {
                res.status(404).send(`admin with id ${id} does not exist`);
            }
        } catch (error) {
            // tslint:disable-next-line:no-console
            console.error(error.message);
            res.status(400).send(error.message);
        }
    });

    app.use('/admin', adminRouter)

    app.locals.adminRouter = adminRouter;
}