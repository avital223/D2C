import * as express from "express";

export const register = ( app: express.Application ) => {
    const oidc = app.locals.oidc;

    // define a route handler for the default home page
    app.get( "/", ( req: any, res ) => {
        res.render( "index" );
    } );

    // define a secure route handler for the login page that redirects to /guitars
    app.get( "/login", oidc.ensureAuthenticated(), ( req, res ) => {
        res.redirect( "/questionare" );
    } );

    // define a route to handle logout
    app.get( "/logout", ( req: any, res ) => {
        req.logout();
        res.redirect( "/" );
    } );

    // define a secure route handler for the guitars page
    app.get( "/questionare", oidc.ensureAuthenticated(), ( req: any, res ) => {
        res.render( "questionare" );
    } );
};