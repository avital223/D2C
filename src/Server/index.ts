import * as express from 'express'
import * as path from "path";
import * as dotenv from "dotenv";
import * as sessionAuth from "../middleware/sessionAuth";
import * as routes from "../routes";
import { connectToDatabase } from "../services/database.service";

// initialize configuration
dotenv.config();

// port is now available to the Node.js runtime
// as if it were an environment variable
const port = process.env.SERVER_PORT;

const app = express();

// Configure Express to use EJS
app.set( "views", path.join( __dirname.split("dist")[0], "dist/views" ) );
app.set( "view engine", "ejs" );

app.use(express.static(path.join(__dirname.split("dist")[0], 'dist/src/controller')));

app.use(express.json())

// Configure session auth
sessionAuth.register( app );

connectToDatabase()
    .then(() => {
        // Configure routes
        routes.register( app );
        app.listen(port, () => {
            // tslint:disable-next-line:no-console
            console.log(`Server started at http://localhost:${port}`);
        });
    })
    .catch((error: Error) => {
        // tslint:disable-next-line:no-console
        console.error("Database connection failed", error);
        process.exit();
    });
