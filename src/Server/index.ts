import * as express from 'express'
import * as path from "path";
import * as dotenv from "dotenv";
import * as sessionAuth from "../middleware/sessionAuth";
import * as routes from "../routes";

// initialize configuration
dotenv.config();

// port is now available to the Node.js runtime
// as if it were an environment variable
const port = process.env.SERVER_PORT;

const app = express();

// Configure Express to use EJS
app.set( "views", path.join( __dirname.split("dist")[0], "dist/views" ) );
app.set( "view engine", "ejs" );

// Configure session auth
sessionAuth.register( app );

// Configure routes
routes.register( app );

// start the express server
app.listen( port, () => {
    // tslint:disable-next-line:no-console
    console.log( `server started at http://localhost:${ port }` );
} );
