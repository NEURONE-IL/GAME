/** External modules **/
const express = require('express');
const cors = require('cors')
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const config = require('config'); //we load the db location from the JSON files
const morgan = require('morgan');
const bcrypt = require('bcryptjs');
require('dotenv').config(); //setup custom environment variables

/** Internal modules **/
require('./config/config');
const authRoutes = require('./routes/auth');
const confirmationRoutes = require('./routes/confirmation');
const challengeRoutes = require('./routes/challenge');
const userRoutes = require('./routes/user');
const studyRoutes = require('./routes/study');
const documentRoutes = require('./routes/document');
const questionnaireRoutes = require('./routes/questionnaire');
const sendEmailRoutes = require('./routes/send-email');

const gamificationRoutes = require('./routes/gamification');
const notificationRoutes = require('./routes/notification');

const keystrokeRoutes = require('./routes/keystroke');
const mouseClickRoutes = require('./routes/mouseClick');
const mouseCoordinateRoutes = require('./routes/mouseCoordinate');
const queryRoutes = require('./routes/query');
const sessionLogRoutes = require('./routes/sessionLog');
const visitedLinkRoutes = require('./routes/visitedLink');
const ScrollRoutes = require('./routes/scroll');

const Role = require('./models/role');
const User = require('./models/user');


//db connection

mongoose.connect('mongodb://admin:admin@localhost:27017/neurone-game', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true})
//mongoose.connect(config.DBHost, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true})
    .then(()=>{
        console.log("Successfully connect to MongoDB.");
        initial();
    });
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));


async function initial() {
     Role.estimatedDocumentCount((err, count) => {
        if (!err && count === 0) {
            new Role({
                name: "admin"
            }).save(err => {
                if (err) {
                    console.log("error", err);
                }

                console.log("added 'admin' to roles collection");
            });
            
            new Role({
                name: "student"
            }).save(err => {
                if (err) {
                    console.log("error", err);
                }

                console.log("added 'student' to roles collection");
            });
        }
    });

}

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
app.use('/api/auth', authRoutes);
app.use('', confirmationRoutes);
app.use('/api/challenge', challengeRoutes);
app.use('/api/user', userRoutes);
app.use('/api/study', studyRoutes);
app.use('/api/document', documentRoutes);
app.use('/api/questionnaire', questionnaireRoutes);

app.use('/api/gamification', gamificationRoutes);
app.use('/api/notification', notificationRoutes);

app.use('/api/send-email', sendEmailRoutes);

app.use('/api/keystroke', keystrokeRoutes);
app.use('/api/mouseClick', mouseClickRoutes);
app.use('/api/mouseCoordinate', mouseCoordinateRoutes);
app.use('/api/query', queryRoutes);
app.use('/api/sessionLog', sessionLogRoutes);
app.use('/api/visitedLink', visitedLinkRoutes);
app.use('/api/scroll', ScrollRoutes);

app.get('/', function (req, res) {
    res.send('Hello World!');
});


/** Server deployment **/
app.listen(process.env.PORT, () => {
    console.log(`Server listening on the port::${process.env.PORT}`);
});

/** Export APP for testing **/
module.exports = app;