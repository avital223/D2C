import * as mongoDB from "mongodb";
import * as dotenv from "dotenv";

export const collections: { questoinare?: mongoDB.Collection } = {}

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
                    bsonType: "number",
                    description: "'category' is required and is a number"
                },
                answers: {
                    bsonType: "array",
                    description: "'questions' is required and is a matrix of answers"
                },
                }
            }
         }
    });

    const questionareCollection: mongoDB.Collection = db.collection(process.env.COLLECTION_NAME);

    collections.questoinare = questionareCollection;

    // tslint:disable-next-line:no-console
    console.log(`Successfully connected to database: ${db.databaseName} and collection: ${questionareCollection.collectionName}`);
}
