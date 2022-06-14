import * as mongoDB from "mongodb";
import * as dotenv from "dotenv";

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
                required: ["hash", "questionareId", "questions","answers"],
                additionalProperties: false,
                properties: {
                _id: {},
                hash: {
                    bsonType: "string",
                    description: "'hash' is required and is a string - The filler hash user"
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
                timestamp: {
                }
                }
            }
         }
    });

    const filledCollection: mongoDB.Collection = db.collection(process.env.COLLECTION_NAME_FILLED);

    collections.filled = filledCollection;


    await db.command({
        "collMod": process.env.COLLECTION_NAME_STAT_FILLED,
        "validator": {
            $jsonSchema: {
                bsonType: "object",
                required: ["age", "hash", "gender", "education", "results", "timestamp"],
                additionalProperties: false,
                properties: {
                _id: {},
                hash: {
                    bsonType: "string",
                    description: "'hash' is required and is a string"
                },
                age: {
                    bsonType: "string",
                    description: "'age' is required and is a number"
                },
                gender: {
                    bsonType: "bool",
                    description: "'gender' is required and is a boolean ( false-Male true-Female)"
                },
                education: {
                    bsonType: "string",
                    description: "'education'  is required and is a number"
                },
                results: {
                    bsonType: "array",
                    description: "'results' is required and is a array of objects of results"
                },
                timestamp: {},
                }
            }
         }
    });
    const filledTestCollection: mongoDB.Collection = db.collection(process.env.COLLECTION_NAME_STAT_FILLED);

    collections.filledTests = filledTestCollection;

    const reportCollection: mongoDB.Collection = db.collection(process.env.COLLECTION_REPORT);

    collections.report = reportCollection;

    const statCollection: mongoDB.Collection = db.collection(process.env.COLLECTION_NAME_STAT);

    collections.stat = statCollection;

    await db.command({
        "collMod": process.env.COLLECTION_USERS,
        "validator": {
            $jsonSchema: {
                bsonType: "object",
                required: ["dob",  "gender", "education", "email"],
                additionalProperties: false,
                properties: {
                _id: {},
                dob: {},
                gender: {
                    bsonType: "bool",
                    description: "'gender' is required and is a boolean ( false-Male true-Female)"
                },
                education: {
                    bsonType: "string",
                    description: "'education'  is required and is a number"
                },
                email: {
                    bsonType: "string",
                    description: "'email' is required and is an email of which therapist is it of."
                },
                }
            }
         }
    });
    const user: mongoDB.Collection = db.collection(process.env.COLLECTION_USERS);

    collections.user = user;
}
