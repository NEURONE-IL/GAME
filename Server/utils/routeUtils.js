const Token = require("../models/token");
const UserStudy = require("../models/userStudy");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const fs = require("fs");
const playerService = require("../services/neuronegm/player");

// Creates user study progress
async function generateProgress(challenges, user, study) {
  let progress = [];

  // Fetch the latest user progress registered for this study
  const lastUserStudy = await UserStudy.findOne({ study: study._id }).sort({
    _id: -1,
  });

  // If found, we generate another challenges sequence shifting all the positions
  // 1 step to the left according to the latest known sequence.
  if (lastUserStudy) {
    challenges = shiftChallenges(lastUserStudy, challenges);
  }

  challenges.forEach((challenge) => {
    progress.push({ challenge: challenge });
  });

  const userStudy = new UserStudy({
    user: user,
    study: study,
    challenges: progress,
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

// Shift challenges according to latest known user progress document
function shiftChallenges(lastUserStudy, challenges) {
    const lastChallengesSequence = lastUserStudy.challenges;
    if (lastChallengesSequence.length >= 1) {
        const firstChallenge = lastChallengesSequence[0].challenge;

        let spacesToShift = challenges.findIndex(
            (ch) => ch._id.toString().localeCompare(firstChallenge) == 0
        );
        spacesToShift = spacesToShift + 1;

        if (spacesToShift && spacesToShift > 0) {
            challenges = challenges
                .slice(spacesToShift)
                .concat(challenges.slice(0, spacesToShift));
        }
    }
    return challenges;
}

// Creates player on NEURONE-GM
function saveGMPlayer(req, user, study, res) {
  playerService.postPlayer(
    {
      name: req.body.names,
      last_name: req.body.last_names,
      sourceId: user._id,
      group_code: study.gm_code,
    },
    (err, data) => {
      if (err) {
        console.log(err);
      } else {
        user.gm_code = data.code;
        user.save((err) => {
          if (err) {
            console.log(err);
          }
        });
      }
    }
  );
}
exports.saveGMPlayer = saveGMPlayer;
// Sends user confirmation email
// Adapted from: https://codemoto.io/coding/nodejs/email-verification-node-express-mongodb
function sendConfirmationEmail(user, userData, res, req) {
  // Create a verification token
  const token = new Token({
    _userId: user._id,
    token: crypto.randomBytes(16).toString("hex"),
  });

  // Save the verification token
  token.save((err) => {
    if (err) {
      return res.status(500).send({ msg: "TOKEN_ERROR" });
    }

    // Generate email data
    const { mailHTML, mailText } = generateEmailData(req, token, userData);

    // Send the email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SENDEMAIL_USER,
        pass: process.env.SENDEMAIL_PASSWORD,
      },
    });
    const mailOptions = {
      from: "neuronemail2020@gmail.com",
      to: user.email,
      subject: "Verifique su correo",
      text: mailText,
      html: mailHTML,
    };
    transporter.sendMail(mailOptions, (err) => {
      if (err) {
        return res.status(500).send({ msg: err.message });
      }
    });
  });
}
exports.sendConfirmationEmail = sendConfirmationEmail;

// Reads email template and adds custom data
function generateEmailData(req, token, userData) {
  const emailTemplateFile = "assets/confirmationEmail.html";
  const link =
    "http://" +
    req.headers.host +
    ":" +
    process.env.PUBLIC_PORT +
    "/confirmation/" +
    token.token;
  let mailHTML = null;
  let mailText =
    "Hola,\n\n" +
    "Por favor, verifique su correo ingresando al siguiente link: \nhttp://" +
    link +
    ".\n";

  // Load email template
  mailHTML = fs.readFileSync(emailTemplateFile, "utf8", (err, data) => {
    if (err) {
      console.log(err);
    }
    mailHTML = data.toString();
  });
  // Add custom text to email
  mailHTML = addTextToEmail(mailHTML, userData, link);
  return { mailHTML, mailText };
}

// Add translated text and user data to email
function addTextToEmail(mailHTML, userData, link) {
  mailHTML = mailHTML.replace(
    "[CONFIRMATION_EMAIL.PREHEADER_TEXT]",
    "Confirme su cuenta:"
  );
  mailHTML = mailHTML.replace(
    "[CONFIRMATION_EMAIL.TITLE]",
    "Hola " + userData.tutor_names.split(" ")[0] + "."
  );
  mailHTML = mailHTML.replace(
    "[CONFIRMATION_EMAIL.TEXT]",
    "Gracias por registrar a " +
      userData.names.split(" ")[0] +
      " en NEURONE-GAME, " +
      "antes de ingresar al juego debe confirmar su correo.\n" +
      "Al realizar este paso, también está confirmando que leyó y acepta el consentimiento informado " +
      "presentado en el registro."
  );
  mailHTML = mailHTML.replace(
    "[CONFIRMATION_EMAIL.CONFIRM]",
    "Confirmar cuenta"
  );
  mailHTML = mailHTML.replace(
    "[CONFIRMATION_EMAIL.IF_BUTTON_DOESNT_WORK_TEXT]",
    "Si el botón no funciona, use el siguiente link:"
  );
  mailHTML = mailHTML.replace(/%CONFIRMATION_EMAIL.LINK%/g, link);
  mailHTML = mailHTML.replace(
    "[CONFIRMATION_EMAIL.IF_LINK_DOESNT_WORK_TEXT]",
    "Si el enlace tampoco funciona, por favor cópielo y péguelo en una nueva pestaña de su navegador de internet:"
  );
  mailHTML = mailHTML.replace("[CONFIRMATION_EMAIL.GREETINGS]", "¡Saludos!");
  return mailHTML;
}






// Sends reset password email
// Adapted from: https://codemoto.io/coding/nodejs/email-verification-node-express-mongodb
function sendResetPasswordEmail(user, res, req) {
  // Create a verification token
  const token = new Token({
    _userId: user._id,
    token: crypto.randomBytes(16).toString("hex"),
  });

  // Save the verification token
  token.save((err) => {
    if (err) {
      console.log(err)
    }

    // Generate email data
    const { mailHTML, mailText } = generateEmailDataRP(req, token, user);

    // Send the email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SENDEMAIL_USER,
        pass: process.env.SENDEMAIL_PASSWORD,
      },
    });
    const mailOptions = {
      from: "neuronemail2020@gmail.com",
      to: user.email,
      subject: "Recupere su contraseña",
      text: mailText,
      html: mailHTML,
    };
    transporter.sendMail(mailOptions, (err) => {
      if (err) {
        console.log( err.message );
      }
    });
  });
}
exports.sendResetPasswordEmail = sendResetPasswordEmail;


// Reads email template and adds custom data
function generateEmailDataRP(req, token, userData) {
  const emailTemplateFile = "assets/resetPassword.html";
  const link =
    "http://" +
    req.headers.host +
    ":" +
    process.env.PUBLIC_PORT +
    "/user/resetPassword/" +
    token.token;
  let mailHTML = null;
  let mailText =
    "Hola,\n\n" +
    "Por favor, recupere su contraseña ingresando siguiente link: \nhttp://" +
    link +
    ".\n";

  // Load email template
  mailHTML = fs.readFileSync(emailTemplateFile, "utf8", (err, data) => {
    if (err) {
      console.log(err);
    }
    mailHTML = data.toString();
  });
  // Add custom text to email
  mailHTML = addTextToEmailRP(mailHTML, userData, link);
  return { mailHTML, mailText };
}

// Add translated text and user data to email
function addTextToEmailRP(mailHTML, userData, link) {
  mailHTML = mailHTML.replace(
    "[RESET_PASSWORD.PREHEADER_TEXT]",
    "Recupere su contraseña:"
  );
  mailHTML = mailHTML.replace(
    "[RESET_PASSWORD.TITLE]",
    "Hola " + userData.names + "."
  );
  mailHTML = mailHTML.replace(
    "[RESET_PASSWORD.TEXT]",
      "Para recuperar su contraseña debe acceder al siguiente link:"
  );
  mailHTML = mailHTML.replace(
    "[RESET_PASSWORD.CONFIRM]",
    "Recuperar contraseña"
  );
  mailHTML = mailHTML.replace(
    "[RESET_PASSWORD.IF_BUTTON_DOESNT_WORK_TEXT]",
    "Si el botón no funciona, use el siguiente link:"
  );
  mailHTML = mailHTML.replace(/%RESET_PASSWORD.LINK%/g, link);
  mailHTML = mailHTML.replace(
    "[RESET_PASSWORD.IF_LINK_DOESNT_WORK_TEXT]",
    "Si el enlace tampoco funciona, por favor cópielo y péguelo en una nueva pestaña de su navegador de internet:"
  );
  mailHTML = mailHTML.replace("[RESET_PASSWORD.GREETINGS]", "¡Saludos!");
  return mailHTML;
}