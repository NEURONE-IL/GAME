/** External modules **/
const express = require('express');
const cors = require('cors')
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const config = require('config'); //we load the db location from the JSON files
const morgan = require('morgan');

/** Internal modules **/
require('./config/config');


//db connection
mongoose.connect(config.DBHost, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true});
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));


/** Express setup **/
const app = express();
app.use(cors())

//don't show the log when it is test
if(config.util.getEnv('NODE_ENV') !== 'test') {
    //use morgan to log at command line
    app.use(morgan('combined')); //'combined' outputs the Apache style LOGs
}

//parse application/json and look for raw text
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: 'application/json'}));

/** Express routing **/


app.get('/', function (req, res) {
    res.send('Hello World!');
});


/** Server deployment **/
app.listen(process.env.PORT, () => {
    console.log(`Server listening on the port::${process.env.PORT}`);
});

/** Export APP for testing **/
module.exports = app;