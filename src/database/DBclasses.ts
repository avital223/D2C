import { ObjectId } from "mongodb";

export class Questionare {
    constructor(public name: string, public questions: string[], public category: number[], public answers: string[][], public id?: ObjectId) {}
}

// tslint:disable-next-line:max-classes-per-file
export class FilledQuestionare {
    constructor(public email: string, public questionareId: string,public questions: string[],  public answers: string[], public id?: ObjectId) {}
}

// tslint:disable-next-line:max-classes-per-file
export class SendEmail {
    constructor(public to:string, public subject:string, public html:string, public text:string) {}
}