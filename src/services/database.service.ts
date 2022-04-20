import * as mongoDB from "mongodb";
import * as dotenv from "dotenv";
import { nextTick } from "process";

export const collections: { [key: string]: mongoDB.Collection } = {}

export async function connectToDatabase () {
    dotenv.config();

    const client: mongoDB.MongoClient = new mongoDB.MongoClient(process.env.DB_CONN_STRING);

    await client.connect();

    const db: mongoDB.Db = client.db(process.env.DB_NAME);

    await db.command({
        "collMod": process.env.COLLECTION_NAME,
        "validator": {
            $jsonSchema: {
                bsonType: "object",
                required: ["name", "questions", "category", "answers"],
                additionalProperties: false,
                properties: {
                _id: {},
                name: {
                    bsonType: "string",
                    description: "'name' is required and is a string"
                },
                questions: {
                    bsonType: "array",
                    description: "'questions' is required and is a list of questions"
                },
                category: {
                    bsonType: "array",
                    description: "'category' is required and is a array of numbers"
                },
                answers: {
                    bsonType: "array",
                    description: "'answers' is required and is a matrix of answers"
                },
                }
            }
         }
    });

    const questionareCollection: mongoDB.Collection = db.collection(process.env.COLLECTION_NAME);

    collections.questoinare = questionareCollection;


    await db.command({
        "collMod": process.env.COLLECTION_NAME_FILLED,
        "validator": {
            $jsonSchema: {
                bsonType: "object",
                required: ["email", "questionareId", "questions","answers"],
                additionalProperties: false,
                properties: {
                _id: {},
                email: {
                    bsonType: "string",
                    description: "'email' is required and is a string - The filler email"
                },
                questionareId: {
                    bsonType: "string",
                    description: "'questionarId' is required and is the ID of the questionare"
                },
                questions: {
                    bsonType: "array",
                    description: "'questions' is required and is a array of questions"
                },
                answers: {
                    bsonType: "array",
                    description: "'answers' is required and is a array of answers"
                },
                }
            }
         }
    });

    const filledCollection: mongoDB.Collection = db.collection(process.env.COLLECTION_NAME_FILLED);

    collections.filled = filledCollection;

    await db.command({
        "collMod": process.env.COLLECTION_NAME_ADMIN,
        "validator": {
            $jsonSchema: {
                bsonType: "object",
                required: ["email", "role"],
                additionalProperties: false,
                properties: {
                _id: {},
                email: {
                    bsonType: "string",
                    description: "'email' is required and is a string - The filler email"
                },
                role: {
                    bsonType: "string",
                    description: "'role' is required and is the role of the admin - 1 super, 2- therapist"
                },
                }
            }
         }
    });

    const adminCollection: mongoDB.Collection = db.collection(process.env.COLLECTION_NAME_ADMIN);

    collections.admin = adminCollection;

    // tslint:disable-next-line:no-console
    console.log(`Successfully connected to database: ${db.databaseName}`);
}
