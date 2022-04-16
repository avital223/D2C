import * as express from "express";
import * as db from "./questionare.router"

export const register = ( app: express.Application ) => {
    const oidc = app.locals.oidc;

    db.questionareConnect(app)

    app.get( "/", ( req: any, res ) => {
        const user = req.userContext ? req.userContext.userinfo : null;
        res.render( "index", { isAuthenticated: req.isAuthenticated(), user } ); // will be the inro page of the web
    } );

    app.get( "/login", oidc.ensureAuthenticated(), ( req, res ) => {
        res.redirect( "/questionare" ); // change to main page one is created!
    } );

    app.get( "/logout", ( req: any, res ) => {
        req.logout();
        res.redirect( "/" );
    } );

    app.get( "/questionare", oidc.ensureAuthenticated(), ( req: any, res ) => {
        const user = req.userContext ? req.userContext.userinfo : null;
        res.render( "questionare", { isAuthenticated: req.isAuthenticated(), user } );
    } );

    app.get( "/listQuestionare", oidc.ensureAuthenticated(), ( req: any, res ) => {
        const user = req.userContext ? req.userContext.userinfo : null;
        res.render( "listQuestionare", { isAuthenticated: req.isAuthenticated(), user } );
    } );

};