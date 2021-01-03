const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Role = require('../models/role');
const Study = require('../models/study');
const Token = require('../models/token');
const Challenge = require('../models/challenge');
const UserStudy = require('../models/userStudy');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");
const crypto = require('crypto');
const fs = require('fs');

const neuronegmService = require('../services/neuronegm/connect');
const playerService = require('../services/neuronegm/player');

const authMiddleware = require('../middlewares/authMiddleware');
const { isValidObjectId } = require('mongoose');

router.post('/register', [authMiddleware.verifyBodyAdmin, authMiddleware.uniqueEmail], async (req, res) => {
    // Role
    const role = await Role.findOne({name: 'admin'}, err => {
        if(err){
            return res.status(404).json({
                ok: false,
                err
            });
        }
    });
    //hash password
    const salt = await bcrypt.genSalt(10);
    const hashpassword = await bcrypt.hash(req.body.password, salt);
    //create user
    const user = new User({
        email: req.body.email.toLowerCase(),
        password: hashpassword,
        role: role._id
    })
    await neuronegmService.connectGM(req.body.email, req.body.password, err => {
        if(err){
            return res.status(404).json({
                ok: false,
                err
            });
        }
    })
    //save user in db
    await user.save((err, user) => {
        if(err){
            return res.status(404).json({
                ok: false,
                err
            });
        }
        res.status(200).json({
            user
        });
    })
})

router.post('/register/:study_id', [authMiddleware.verifyBody, authMiddleware.uniqueEmail], async (req, res)=>{

    const study_id = req.params.study_id;
    if(!isValidObjectId(study_id)){
        return res.status(404).json({
            ok: false,
            message: "Study doesn't exist!"
        });
    }

    // Find student role
    const role = await Role.findOne({name: 'student'}, err => {
        if(err){
            return res.status(404).json({
                ok: false,
                err
            });
        }
    });

    // Find study
    const study = await Study.findOne({_id: study_id}, err => {
        if(err){
            return res.status(404).json({
                ok: false,
                err
            });
        }
    });

    // Find study challenges
    const challenges = await Challenge.find({study: study}, err => {
        if(err){
            return res.status(404).json({
                ok: false,
                err
            });
        }
    });

    if(!study){
        return res.status(404).json({
            ok: false,
            message: "STUDY_NOT_FOUND_ERROR"
        });
    }

    //hash password
    const salt = await bcrypt.genSalt(10);
    const hashpassword = await bcrypt.hash(req.body.password, salt);

    //create user
    const user = new User({
        email: req.body.email,
        tutor_names: req.body.tutor_names,
        tutor_last_names: req.body.tutor_last_names,
        tutor_phone: req.body.tutor_phone,
        names: req.body.names,
        last_names: req.body.last_names,
        birthday: req.body.birthday,
        course: req.body.course,
        institution: req.body.institution,
        institution_commune: req.body.institution_commune,
        institution_region: req.body.institution_region,
        password: hashpassword,
        role: role._id,
        study: study._id,
        relation: req.body.relation
    });

    //save user in db
    user.save((err, user) => {
        if(err){
            return res.status(404).json({
                ok: false,
                err
            });
        }

        // Generate user study progress entry
        generateProgress(challenges, user, study);

        // Send confirmation email
        sendConfirmationEmail(user, res, req);

        // Register player in NEURONE-GM
        saveGMPlayer(req, user, res);

        res.status(200).json({
            user
        });
    });
});

router.post('/login', async (req, res) => {
    //checking if username exists
    const user = await User.findOne({ email: req.body.email.toLowerCase() }).populate('role');
    if(!user) res.status(400).send('EMAIL_NOT_FOUND');
    //checking password
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if(!validPass) res.status(400).send('INVALID_PASSWORD');
    //check if user is confirmed
    if(!user.confirmed) res.status(400).send('USER_NOT_CONFIRMED');
    //create and assign a token
    const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET);
    res.header('x-access-token', token).send({user: user, token: token});
});

// Creates user study progress
function generateProgress(challenges, user, study) {
    let progress = [];

    // WIP: getting last registered sequence
    UserStudy.find().sort({ _id: -1 }).limit(1).then((result) => {
        console.log('last user study progress');
        console.log(result);
    });

    challenges.forEach((challenge) => {
        progress.push({ challenge: challenge });
    });

    const userStudy = new UserStudy({
        user: user,
        study: study,
        challenges: progress
    });

    userStudy.save((err, res) => {
        if (err) {
            return res.status(404).json({
                ok: false,
                err
            });
        }
    });
}

// Creates player on NEURONE-GM
function saveGMPlayer(req, user, res) {
    playerService.postPlayer({ name: req.body.names, last_name: req.body.last_names, sourceId: user._id }, (err, data) => {
        if (err) {
            console.log(err);
            res.status(200).json({
                user
            });
        }
        else {
            user.gm_code = data.code;
            user.save(err => {
                if (err) {
                    return res.status(404).json({
                        ok: false,
                        err
                    });
                }
            });
        }
    });
}

// Sends user confirmation email
// Adapted from: https://codemoto.io/coding/nodejs/email-verification-node-express-mongodb
function sendConfirmationEmail(user, res, req) {

    // Create a verification token
    const token = new Token({ _userId: user._id, token: crypto.randomBytes(16).toString('hex') });

    // Save the verification token
    token.save((err) => {
        if (err) { return res.status(500).send({ msg: 'TOKEN_ERROR' }); }

        // Generate email data
        const { mailHTML, mailText } = generateEmailData(req, token, user);

        // Send the email
        const transporter = nodemailer.createTransport({ service: 'gmail', auth: { user: process.env.SENDEMAIL_USER, pass: process.env.SENDEMAIL_PASSWORD } });
        const mailOptions = { from: 'neuronemail2020@gmail.com', to: user.email, subject: 'Verifique su correo', text: mailText, html: mailHTML };
        transporter.sendMail(mailOptions, (err) => {
            if (err) { return res.status(500).send({ msg: err.message }); }
        });
    });
}

// Reads email template and adds custom data
function generateEmailData(req, token, user) {
    const emailTemplateFile = 'assets/confirmationEmail.html';
    const link = 'http://' + req.headers.host + '\/confirmation\/' + token.token;
    let mailHTML = null;
    let mailText = 'Hola,\n\n' + 'Por favor, verifique su correo ingresando al siguiente link: \nhttp:\/\/' + link + '.\n';

    // Load email template
    mailHTML = fs.readFileSync(emailTemplateFile, 'utf8', (err, data) => {
        if (err) { console.log(err); }
        mailHTML = data.toString();
    });
    // Add custom text to email
    mailHTML = addTextToEmail(mailHTML, user, link);
    return { mailHTML, mailText };
}

// Add translated text and user data to email
function addTextToEmail(mailHTML, user, link) {
    mailHTML = mailHTML.replace("[CONFIRMATION_EMAIL.PREHEADER_TEXT]", "Confirme su cuenta:");
    mailHTML = mailHTML.replace("[CONFIRMATION_EMAIL.TITLE]","Hola " + user.tutor_names.split(" ")[0] + ".");
    mailHTML = mailHTML.replace("[CONFIRMATION_EMAIL.TEXT]","Gracias por registrar a " + user.names.split(" ")[0] +" en NEURONE-GAME, "
                                + "antes de ingresar al juego debe confirmar su correo.\n"
                                + "Al realizar este paso, también está confirmando que leyó y acepta el consentimiento informado "
                                + "presentado en el registro.");
    mailHTML = mailHTML.replace("[CONFIRMATION_EMAIL.CONFIRM]", "Confirmar cuenta");
    mailHTML = mailHTML.replace("[CONFIRMATION_EMAIL.IF_BUTTON_DOESNT_WORK_TEXT]", "Si el botón no funciona, usa el siguiente link:");
    mailHTML = mailHTML.replace(/%CONFIRMATION_EMAIL.LINK%/g, link);
    mailHTML = mailHTML.replace("[CONFIRMATION_EMAIL.GREETINGS]", "¡Saludos!");
    return mailHTML;
}

module.exports = router;