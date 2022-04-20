import { ObjectId } from "mongodb";

export class Questionare {
    constructor(public name: string, public questions: string[], public category: number[], public answers: string[][], public id?: ObjectId) {}
}

// tslint:disable-next-line:max-classes-per-file
export class FilledQuestionare {
    constructor(public email: string, public questionareId: string,public questions: string[],  public answers: string[], public id?: ObjectId) {}
}

// tslint:disable-next-line:max-classes-per-file
export class Admin {
    constructor(public email: string, public role: number, public id?: ObjectId) {}
}