import * as express from "express";
import * as dbQ from "./questionare.router"
import * as dbF from "./filled.router"

export const register = ( app: express.Application ) => {
    const oidc = app.locals.oidc;

    dbQ.questionareConnect(app)

    dbF.filledQuestionareConnect(app)

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
            res.render( "questionare", { isAuthenticated: req.isAuthenticated(), user } );
        } else {
            res.render( "index", { isAuthenticated: req.isAuthenticated(), user } ); // chnage later to error page
        }
    } );

    app.get( "/listQuestionare", oidc.ensureAuthenticated(), ( req: any, res ) => {
        const user = req.userContext ? req.userContext.userinfo : null;
        if (user.groups.indexOf("Admin") > -1){
            res.render( "listQuestionare", { isAuthenticated: req.isAuthenticated(), user } );
        } else {
            res.render( "index", { isAuthenticated: req.isAuthenticated(), user } ); // chnage later to error page
        }
    } );

    app.get( "/listMyQuestionare", oidc.ensureAuthenticated(), ( req: any, res ) => {
        const user = req.userContext ? req.userContext.userinfo : null;
        res.render( "listUserQuestionares", { isAuthenticated: req.isAuthenticated(), user } );
    } );

    app.get( "/editQuestionare", oidc.ensureAuthenticated(), ( req: any, res ) => {
        const user = req.userContext ? req.userContext.userinfo : null;
        if (user.groups.indexOf("Admin") > -1){
            res.render( "editQuestionare", { isAuthenticated: req.isAuthenticated(), user, res } );
        } else {
            res.render( "index", { isAuthenticated: req.isAuthenticated(), user } ); // chnage later to error page
        }
    } );

    app.get( "/fillQuestionare", oidc.ensureAuthenticated(), ( req: any, res ) => {
        const user = req.userContext ? req.userContext.userinfo : null;
        res.render( "fillQuestionare", { isAuthenticated: req.isAuthenticated(), user, res } );
    } );
};