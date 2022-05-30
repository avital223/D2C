import { ObjectId } from "mongodb";

export class Questionare {
    constructor(public name: string, public questions: string[], public category: number[], public answers: string[][], public id?: ObjectId) {}
}

// tslint:disable-next-line:max-classes-per-file
export class FilledQuestionare {
    constructor(public hash: string, public questionareId: string,public questions: string[],  public answers: string[], public timestamp: Date,  public id?: ObjectId) {}
}

// tslint:disable-next-line:max-classes-per-file
export class SendEmail {
    constructor(public to:string, public subject:string, public html:string, public text:string) {}
}

// tslint:disable-next-line:max-classes-per-file
export class Stats {
    constructor(public name:string, public order:string, public data:object) {}
}

// tslint:disable-next-line:max-classes-per-file
export class FilledTests {
    constructor(public age:string, public hash:string, public gender:boolean, public education:string,public results:object[], public timestamp:Date, public id?: ObjectId) {}
}