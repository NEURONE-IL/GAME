/** External modules **/
const express = require('express');
const cors = require('cors')
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const config = require('config'); //we load the db location from the JSON files
const morgan = require('morgan');
const bcrypt = require('bcryptjs');
const path = require('path');
require('dotenv').config(); //setup custom environment variables

/** Internal modules **/
require('./config/config');
const authRoutes = require('./routes/auth');
const siteRoutes = require('./routes/site');
const confirmationRoutes = require('./routes/confirmation');
const challengeRoutes = require('./routes/challenge');
const userRoutes = require('./routes/user');
const studyRoutes = require('./routes/study');
const documentRoutes = require('./routes/document');
const questionnaireRoutes = require('./routes/questionnaire');
const sendEmailRoutes = require('./routes/send-email');

const imageRoutes = require('./routes/image');
const gamificationRoutes = require('./routes/gamification');
const notificationRoutes = require('./routes/notification');
const forwardRoutes = require('./routes/forward');

const historyRoutes = require('./routes/history');
const invitationRoutes = require('./routes/invitation');
const adminNotificationRoutes = require('./routes/adminNotification');
const studySearchRoutes = require('./routes/studySearch');
const competencesRoutes = require('./routes/competence');
const languagesRoutes = require('./routes/language');

const keystrokeRoutes = require('./routes/keystroke');
const mouseClickRoutes = require('./routes/mouseClick');
const mouseCoordinateRoutes = require('./routes/mouseCoordinate');
const queryRoutes = require('./routes/query');
const sessionLogRoutes = require('./routes/sessionLog');
const visitedLinkRoutes = require('./routes/visitedLink');
const ScrollRoutes = require('./routes/scroll');
const EventRoutes = require('./routes/event');


const Role = require('./models/role');
const Study = require('./models/study');
const Challenge = require('./models/challenge');
const Competence = require('./models/competence');
const Language = require('./models/language');

//db connection

//mongoose.connect('mongodb://admin:admin@localhost:27017/neurone-game', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true})
mongoose.connect(process.env.URI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true})
    .then(()=>{
        console.log("Successfully connect to MongoDB.");
        //cleanEdit();
        initial();
        //addCompetences();
        //addLanguages();
    });
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

async function cleanEdit(){
    const studies = await Study.find({}, (err, studies) => {
        if(err){
            console.log(err)
        }
    })
    studies.forEach(async study => {
        study.edit = [];
        study.save(err => {
            if(err){
                console.log(err)
            }
        })
    })

    challenges = await Challenge.find({}, (err, challenges) => {
        if(err){
            console.log(err)
        }
    })
    challenges.forEach(async challenge => {
        challenge.edit = [];
        challenge.save(err => {
            if(err){
                console.log(err)
            }
        })
    })
}

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

/*async function addCompetences() {
    const currentCompetences = ['Búsqueda', 'Localización', 'Evaluación Crítica', 'Síntesis', 'Comunicación']
    Competence.estimatedDocumentCount(async (err, count) => {
        if (!err && count === 0) {
            currentCompetences.forEach(element => {
                new Competence({
                    name: element
                }).save(err => {
                    if (err) {
                        console.log("error", err);
                    }
     
                    console.log("added %s to competences collection",element);
                });
            });
        }
   });

}
async function addLanguages() {
    const currentLanguages = ['Español', 'Inglés']
    Language.estimatedDocumentCount(async (err, count) => {
        if (!err && count === 0) {
            currentLanguages.forEach(element => {
                new Language({
                    name: element
                }).save(err => {
                    if (err) {
                        console.log("error", err);
                    }
     
                    console.log("added %s to languages collection",element);
                });
            });
        }
   });

}*/

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
app.use('/api/site', siteRoutes);
app.use('', confirmationRoutes);
app.use('/api/challenge', challengeRoutes);
app.use('/api/user', userRoutes);
app.use('/api/study', studyRoutes);
app.use('/api/document', documentRoutes);
app.use('/api/questionnaire', questionnaireRoutes);

app.use('/api/image', imageRoutes);
app.use('/api/gamification', gamificationRoutes);
app.use('/api/notification', notificationRoutes);
app.use('/api/forward', forwardRoutes);

app.use('/api/history', historyRoutes);
app.use('/api/invitation', invitationRoutes);
app.use('/api/adminNotification', adminNotificationRoutes);
app.use('/api/competence', competencesRoutes);
app.use('/api/language', languagesRoutes);

app.use('/api/send-email', sendEmailRoutes);

app.use('/api/keystroke', keystrokeRoutes);
app.use('/api/mouseClick', mouseClickRoutes);
app.use('/api/mouseCoordinate', mouseCoordinateRoutes);
app.use('/api/query', queryRoutes);
app.use('/api/sessionLog', sessionLogRoutes);
app.use('/api/visitedLink', visitedLinkRoutes);
app.use('/api/scroll', ScrollRoutes);
app.use('/api/event', EventRoutes);

app.use('/api/studySearch', studySearchRoutes);



// Serve neurone docs
app.use("/assets/", express.static(process.env.NEURONE_DOCS));

// Set client on root

// - Serve static content
app.use(express.static('public'));
// - Serve index
app.get('*',function(req,res){
  res.sendFile(path.join(__dirname+'/public/index.html'));
});


/** Server deployment **/
app.listen(process.env.PORT, () => {
    console.log(`NEURONE-GAME listening on the port::${process.env.PORT}`);
});

/** Export APP for testing **/
module.exports = app;