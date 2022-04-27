import * as express from "express";
import {questionareConnect} from "./questionare.router"
import {filledQuestionareConnect} from "./filled.router"
import { emailConnect } from "./email.router";

export const register = ( app: express.Application ) => {
    const oidc = app.locals.oidc;

    questionareConnect(app)

    filledQuestionareConnect(app)

    emailConnect(app)

    app.get( "/", ( req: any, res ) => {
        const user = req.userContext ? req.userContext.userinfo : null;
        res.render( "index", { isAuthenticated: req.isAuthenticated(), user } ); // will be the intro page of the web
    } );

    app.get( "/login", oidc.ensureAuthenticated(), ( _req, res ) => {
        res.redirect( "/questionare" ); // change to main page one is created!
    } );

    app.get( "/logout", ( req: any, res ) => {
        req.logout();
        res.redirect( "/" );
    } );

    app.get( "/questionare", oidc.ensureAuthenticated(), ( req: any, res ) => {
        const user = req.userContext ? req.userContext.userinfo : null;
        if (user.groups.indexOf("Admin") > -1){
            res.render( "questionare/questionare", { isAuthenticated: req.isAuthenticated(), user } );
        } else {
            res.redirect( "/" ); // chnage later to error page
        }
    } );

    app.get( "/sendEmail", oidc.ensureAuthenticated(), ( req: any, res ) => {
        const user = req.userContext ? req.userContext.userinfo : null;
        if (user.groups.indexOf("Admin") > -1){
            res.render( "questionare/sendEmail", { isAuthenticated: req.isAuthenticated(), user } );
        } else {
            res.redirect( "/" ); // chnage later to error page
        }
    } );

    app.get( "/listQuestionare", oidc.ensureAuthenticated(), ( req: any, res ) => {
        const user = req.userContext ? req.userContext.userinfo : null;

    app.get( "/addCSV", oidc.ensureAuthenticated(), ( req: any, res ) => {
        const user = req.userContext ? req.userContext.userinfo : null;
        res.render( "csv", { isAuthenticated: req.isAuthenticated(), user, res } );
    } );

        if (user.groups.indexOf("Admin") > -1){
            res.render( "questionare/listQuestionare", { isAuthenticated: req.isAuthenticated(), user } );
        } else {
            res.redirect( "listMyQuestionare" ); // chnage later to error page
        }
    } );

    app.get( "/compareTwoQuestionares", oidc.ensureAuthenticated(), ( req: any, res ) => {
        const user = req.userContext ? req.userContext.userinfo : null;
        if (user.groups.indexOf("Admin") > -1){
            res.render( "questionare/compareTwoQuestionares", { isAuthenticated: req.isAuthenticated(), user } );
        } else {
            res.redirect( "/" ); // chnage later to error page
        }
    } );

    app.get( "/listMyQuestionare", oidc.ensureAuthenticated(), ( req: any, res ) => {
        const user = req.userContext ? req.userContext.userinfo : null;
        res.render( "questionare/listUserQuestionares", { isAuthenticated: req.isAuthenticated(), user } );
    } );

    app.get( "/editQuestionare", oidc.ensureAuthenticated(), ( req: any, res ) => {
        const user = req.userContext ? req.userContext.userinfo : null;
        if (user.groups.indexOf("Admin") > -1){
            res.render( "questionare/editQuestionare", { isAuthenticated: req.isAuthenticated(), user, res } );
        } else {
            res.redirect( "/" ); // chnage later to error page
        }
    } );

    app.get( "/fillQuestionare", oidc.ensureAuthenticated(), ( req: any, res ) => {
        const user = req.userContext ? req.userContext.userinfo : null;
        res.render( "questionare/fillQuestionare", { isAuthenticated: req.isAuthenticated(), user, res } );
    } );
};