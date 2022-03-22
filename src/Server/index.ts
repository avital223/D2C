import * as express from 'express'
import * as path from "path";
import * as http from "http";
const app = express()

// Configure Express to use EJS
app.set( "views", path.join( __dirname.split("dist")[0], "dist/views" ) );
app.set( "view engine", "ejs" );

app.get('/', (req, res) => {
    res.render( "index" );
});

app.use((req, res, next) => {
    res.status(404).send("Sorry, that page doesn't exist. Have a nice day :)");
});

// your express configuration here
const httpServer = http.createServer( app);

// For https
httpServer.listen(8080);


// Start the server
// app.listen(8080, () => console.log("Listening"))