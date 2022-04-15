import { ObjectId } from "mongodb";

export default class Questionare {
    constructor(public name: string, public questions: string[], public category: number, public answers: string[][], public id?: ObjectId) {}
}