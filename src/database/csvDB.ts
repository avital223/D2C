import { ObjectId } from "mongodb";

export default class Csv {
    constructor(public name: string, public questions: string[], public category: number[], public answers: string[][], public id?: ObjectId) {}
}
