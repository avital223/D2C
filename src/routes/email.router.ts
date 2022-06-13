import * as express  from "express";
import * as dotenv from "dotenv";
import * as nodemailer from "nodemailer";
import { SendEmail } from "../database/DBclasses";
import { getMaxListeners } from "process";

dotenv.config()

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

// tslint:disable-next-line:no-console
transporter.verify().catch(console.error);

export const emailConnect = (app: express.Application ) => {
    const oidc = app.locals.oidc;

    app.post( "/email", oidc.ensureAuthenticated(), ( req: any, res ) => {
        const user = req.userContext ? req.userContext.userinfo : null;
        const email = req.body as SendEmail
        if (user.groups.indexOf("Admin") > -1 || user.groups.indexOf("Therapists") > -1){
            transporter.sendMail({
                from:email.from, // sender address
                to: email.to, // list of receivers
                subject: email.subject, // Subject line
                html: email.html.toString() // plain text body
            // tslint:disable-next-line:no-console
            }).catch(console.error);
        } else {
            // tslint:disable-next-line:no-console
            console.error("error");
        }
    });

    app.post( "/mail", oidc.ensureAuthenticated(), ( req: any, res ) => {
        const user = req.userContext ? req.userContext.userinfo : null;
        const email = req.body as SendEmail
        if (user.groups.indexOf("Admin") > -1 || user.groups.indexOf("Therapists") > -1){
            transporter.sendMail({
                from:email.from, // sender address
                to: "michellerabkin223@gmail.com", // list of receivers
                subject: email.subject, // Subject line
                html: email.html.toString() // plain text body
            // tslint:disable-next-line:no-console
            }).catch(console.error);
        } else {
            // tslint:disable-next-line:no-console
            console.error("error");
        }
    });
}