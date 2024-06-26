const express = require("express");
const bodyParser = require('body-parser');
var cors = require('cors');
const database = require("./config/database");
const cookieParser = require('cookie-parser');
require("dotenv").config();
const routesApiVer1 = require("./api/v1/routes/index.route");
const app = express();
const port = process.env.PORT;

database.connect();


app.use(cookieParser());
// cors
app.use(cors());

// parse application/json
app.use(bodyParser.json())

routesApiVer1(app);

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})