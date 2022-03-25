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
    let newPath = req.path;
    // remove any query string
    const index = newPath.indexOf("?");
    if (index >= 0) {
        newPath = newPath.slice(0, index);
    }

    // remove leading /
    newPath = newPath.split("/")[1];

    // let res.render() tell us whether the file exists or not
    res.render(newPath,  (err: any, resp: { status: (arg0: number) => { (): any; new(): any; send: { (arg0: string): void; new(): any; }; }; send: (arg0: any) => void; }) => {
        if (err) {
            next()
        } else {
            res.send(resp);
        }
    });
});

app.use((req, res) =>{
    res.status(404).send("Sorry, that page doesn't exist. Have a nice day :)");
});
// your express configuration here
const httpServer = http.createServer(app);

// For https
httpServer.listen(8080);
