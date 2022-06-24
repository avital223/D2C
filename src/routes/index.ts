import * as express from "express";
import {questionareConnect} from "./questionare.router"
import {filledQuestionareConnect} from "./filled.router"
import { emailConnect} from "./email.router";
import { statsDBConnect } from "./stats.db.router";
import { statConnect } from "./stats.router";
import { filledTests } from "./filltests.router";
import { produceReportConnect } from "./report.router";
import { usersConnect } from "./users.router";

export const register = ( app: express.Application ) => {
    const oidc = app.locals.oidc;

    questionareConnect(app)

    filledQuestionareConnect(app)

    emailConnect(app)

    statConnect(app)

    filledTests(app)

    produceReportConnect(app)

    usersConnect(app)

    app.get( "/", ( req: any, res ) => {
        const user = req.userContext ? req.userContext.userinfo : null;
        res.render( "index", { isAuthenticated: req.isAuthenticated(), user } );
    } );

    app.get( "/login", oidc.ensureAuthenticated(), ( _req, res ) => {
        res.redirect( "/questionare" ); // change to main page one is created!
    } );

    app.get( "/logout", ( req: any, res ) => {
        req.logout();
        res.redirect( "/" );
    } );

    app.get( "/error", ( req: any, res ) => {
        const user = req.userContext ? req.userContext.userinfo : null;
        res.render( "adminestrative/errorPage", { isAuthenticated: req.isAuthenticated(), user } );
    } );
    app.get( "/questionare", oidc.ensureAuthenticated(), ( req: any, res ) => {
        const user = req.userContext ? req.userContext.userinfo : null;
        if (user.groups.indexOf("Admin") > -1){
            res.render( "questionare/questionare", { isAuthenticated: req.isAuthenticated(), user } );
        } else {
            res.redirect( "/error" );
        }
    } );

    app.get( "/sendEmail", oidc.ensureAuthenticated(), ( req: any, res ) => {
        const user = req.userContext ? req.userContext.userinfo : null;
        if (user.groups.indexOf("Admin") > -1 || user.groups.indexOf("Therpaists") > -1){
            res.render( "questionare/sendEmail", { isAuthenticated: req.isAuthenticated(), user } );
        } else {
            res.redirect( "/error" );
        }
    } );

    app.get( "/listQuestionare", oidc.ensureAuthenticated(), ( req: any, res ) => {
        const user = req.userContext ? req.userContext.userinfo : null;
        if (user.groups.indexOf("Admin") > -1 || user.groups.indexOf("Therpaists") > -1){
            res.render( "questionare/listQuestionare", { isAuthenticated: req.isAuthenticated(), user } );
        } else {
            res.redirect( "/error" );
        }
    } );

    app.get( "/compareTwoQuestionares", oidc.ensureAuthenticated(), ( req: any, res ) => {
        const user = req.userContext ? req.userContext.userinfo : null;
        if (user.groups.indexOf("Admin") > -1 || user.groups.indexOf("Therpaists") > -1){
            res.render( "questionare/compareTwoQuestionares", { isAuthenticated: req.isAuthenticated(), user } );
        } else {
            res.redirect( "/error" );
        }
    } );

    app.get( "/csv", oidc.ensureAuthenticated(), ( req: any, res ) => {
        const user = req.userContext ? req.userContext.userinfo : null;
        if (user.groups.indexOf("Admin") > -1 || user.groups.indexOf("Therpaists") > -1){
            res.render( "csv/csv", { isAuthenticated: req.isAuthenticated(), user, res } );
        } else {
            res.redirect( "/error" );
        }
    } );

    app.get( "/manualTest", oidc.ensureAuthenticated(), ( req: any, res ) => {
        const user = req.userContext ? req.userContext.userinfo : null;
        if (user.groups.indexOf("Admin") > -1 || user.groups.indexOf("Therpaists") > -1){
            res.render( "csv/manualTest", { isAuthenticated: req.isAuthenticated(), user, res } );
        } else {
            res.redirect( "/error" );
        }
    } );
    app.get( "/mail", oidc.ensureAuthenticated(), ( req: any, res ) => {
        const user = req.userContext ? req.userContext.userinfo : null;
        res.render( "adminestrative/mail", { isAuthenticated: req.isAuthenticated(), user } );
    } );


    app.get( "/thankYou", oidc.ensureAuthenticated(), ( req: any, res ) => {
        const user = req.userContext ? req.userContext.userinfo : null;
        res.render( "adminestrative/thankYou", { isAuthenticated: req.isAuthenticated(), user } );
    } );

    app.get( "/addUser", oidc.ensureAuthenticated(), ( req: any, res ) => {
        const user = req.userContext ? req.userContext.userinfo : null;
        if (user.groups.indexOf("Admin") > -1 || user.groups.indexOf("Therpaists") > -1){
            res.render( "adminestrative/addUser", { isAuthenticated: req.isAuthenticated(), user, res } );
        } else {
            res.redirect( "/error" );
        }
    } );
    app.get( "/listUsers", oidc.ensureAuthenticated(), ( req: any, res ) => {
        const user = req.userContext ? req.userContext.userinfo : null;
        if (user.groups.indexOf("Admin") > -1 || user.groups.indexOf("Therpaists") > -1){
            res.render( "adminestrative/listUsers", { isAuthenticated: req.isAuthenticated(), user, res } );
        } else {
            res.redirect( "/error" );
        }
    } );

    app.get( "/editQuestionare", oidc.ensureAuthenticated(), ( req: any, res ) => {
        const user = req.userContext ? req.userContext.userinfo : null;
        if (user.groups.indexOf("Admin") > -1){
            res.render( "questionare/editQuestionare", { isAuthenticated: req.isAuthenticated(), user, res } );
        } else {
            res.redirect( "/error" );
        }
    } );
    app.get( "/produceReport", oidc.ensureAuthenticated(), ( req: any, res ) => {
        const user = req.userContext ? req.userContext.userinfo : null;
        if (user.groups.indexOf("Admin") > -1 || user.groups.indexOf("Therpaists") > -1){
            res.render( "report/chooseId", { isAuthenticated: req.isAuthenticated(), user, res } );
        } else {
            res.redirect( "/error" );
        }
    } );

    app.get("/produced", oidc.ensureAuthenticated(), ( req: any, res ) => {
        const user = req.userContext ? req.userContext.userinfo : null;
        if (user.groups.indexOf("Admin") > -1 || user.groups.indexOf("Therpaists") > -1){
            res.render( "report/editReport", { isAuthenticated: req.isAuthenticated(), user, res} );
        } else {
            res.redirect( "/error" );
        }
    })

    app.get( "/fillQuestionare", oidc.ensureAuthenticated(), ( req: any, res ) => {
        const user = req.userContext ? req.userContext.userinfo : null;
        if(user !== null){
            res.render( "questionare/fillQuestionare", { isAuthenticated: req.isAuthenticated(), user, res } );
        } else{
            res.redirect( "/error" );
        }
    } );
};