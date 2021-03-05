const Token = require('../models/token');
const UserStudy = require('../models/userStudy');
const nodemailer = require("nodemailer");
const crypto = require('crypto');
const fs = require('fs');
const playerService = require('../services/neuronegm/player');

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

    return new Promise((resolve, reject) => {
        userStudy.save((err, res) => {
            if (err) {
                reject(err);
            }
            resolve(res);
        });
      });
}
exports.generateProgress = generateProgress;
// Creates player on NEURONE-GM
function saveGMPlayer(req, user, study, res) {
    playerService.postPlayer({ name: req.body.names, last_name: req.body.last_names, sourceId: user._id, group_code: study.gm_code }, (err, data) => {
        if (err) {
            console.log(err);
        }
        else {
            user.gm_code = data.code;
            user.save(err => {
                if (err) {
                    console.log(err);
                }
            });
        }
    });
}
exports.saveGMPlayer = saveGMPlayer;
// Sends user confirmation email
// Adapted from: https://codemoto.io/coding/nodejs/email-verification-node-express-mongodb
function sendConfirmationEmail(user, userData, res, req) {

    // Create a verification token
    const token = new Token({ _userId: user._id, token: crypto.randomBytes(16).toString('hex') });

    // Save the verification token
    token.save((err) => {
        if (err) { return res.status(500).send({ msg: 'TOKEN_ERROR' }); }

        // Generate email data
        const { mailHTML, mailText } = generateEmailData(req, token, userData);

        // Send the email
        const transporter = nodemailer.createTransport({ service: 'gmail', auth: { user: process.env.SENDEMAIL_USER, pass: process.env.SENDEMAIL_PASSWORD } });
        const mailOptions = { from: 'neuronemail2020@gmail.com', to: user.email, subject: 'Verifique su correo', text: mailText, html: mailHTML };
        transporter.sendMail(mailOptions, (err) => {
            if (err) { return res.status(500).send({ msg: err.message }); }
        });
    });
}
exports.sendConfirmationEmail = sendConfirmationEmail;
// Reads email template and adds custom data
function generateEmailData(req, token, userData) {
    const emailTemplateFile = 'assets/confirmationEmail.html';
    const link = 'http://' + req.headers.host + ':' + process.env.PUBLIC_PORT + '\/confirmation\/' + token.token;
    let mailHTML = null;
    let mailText = 'Hola,\n\n' + 'Por favor, verifique su correo ingresando al siguiente link: \nhttp:\/\/' + link + '.\n';

    // Load email template
    mailHTML = fs.readFileSync(emailTemplateFile, 'utf8', (err, data) => {
        if (err) { console.log(err); }
        mailHTML = data.toString();
    });
    // Add custom text to email
    mailHTML = addTextToEmail(mailHTML, userData, link);
    return { mailHTML, mailText };
}
// Add translated text and user data to email
function addTextToEmail(mailHTML, userData, link) {
    mailHTML = mailHTML.replace("[CONFIRMATION_EMAIL.PREHEADER_TEXT]", "Confirme su cuenta:");
    mailHTML = mailHTML.replace("[CONFIRMATION_EMAIL.TITLE]", "Hola " + userData.tutor_names.split(" ")[0] + ".");
    mailHTML = mailHTML.replace("[CONFIRMATION_EMAIL.TEXT]", "Gracias por registrar a " + userData.names.split(" ")[0] + " en NEURONE-GAME, "
        + "antes de ingresar al juego debe confirmar su correo.\n"
        + "Al realizar este paso, también está confirmando que leyó y acepta el consentimiento informado "
        + "presentado en el registro.");
    mailHTML = mailHTML.replace("[CONFIRMATION_EMAIL.CONFIRM]", "Confirmar cuenta");
    mailHTML = mailHTML.replace("[CONFIRMATION_EMAIL.IF_BUTTON_DOESNT_WORK_TEXT]", "Si el botón no funciona, use el siguiente link:");
    mailHTML = mailHTML.replace(/%CONFIRMATION_EMAIL.LINK%/g, link);
    mailHTML = mailHTML.replace("[CONFIRMATION_EMAIL.IF_LINK_DOESNT_WORK_TEXT]", "Si el enlace tampoco funciona, por favor cópielo y péguelo en una nueva pestaña de su navegador de internet:"); 
    mailHTML = mailHTML.replace("[CONFIRMATION_EMAIL.GREETINGS]", "¡Saludos!");
    return mailHTML;
}
