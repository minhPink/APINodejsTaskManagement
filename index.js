const express = require("express");
const bodyParser = require('body-parser');
var cors = require('cors');
const database = require("./config/database");
require("dotenv").config();
const app = express();
const port = process.env.PORT;

database.connect();

const routesApiVer1 = require("./api/v1/routes/index.route");

// cors
app.use(cors());

// parse application/json
app.use(bodyParser.json())

routesApiVer1(app);

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})