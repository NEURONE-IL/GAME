const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const User = require("../models/user");
const UserData = require("../models/userData");
const Role = require("../models/role");
const Study = require("../models/study");
const Challenge = require("../models/challenge");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const verifyToken = require("../middlewares/verifyToken");
const fs = require("fs");

const neuronegmService = require("../services/neuronegm/connect");

const authMiddleware = require("../middlewares/authMiddleware");
const { isValidObjectId } = require("mongoose");
const {
  generateProgress,
  saveGMPlayer,
  sendConfirmationEmail,
} = require("../utils/routeUtils");

router.post(
  "/register",
  [authMiddleware.verifyBodyAdmin, authMiddleware.uniqueEmail],
  async (req, res) => {
    // Role
    const role = await Role.findOne({ name: "admin" }, (err) => {
      if (err) {
        return res.status(404).json({
          ok: false,
          err,
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
      names: req.body.names,
      last_names: req.body.last_names,
      role: role._id,
    });
    await neuronegmService.connectGM(
      req.body.email,
      req.body.password,
      (err) => {
        if (err) {
          console.log(err);
        }
      }
    );
    //save user in db
    await user.save((err, user) => {
      if (err) {
        return res.status(404).json({
          ok: false,
          err,
        });
      }
      res.status(200).json({
        user,
      });
    });
  }
);

router.post(
  "/register/:study_id",
  [authMiddleware.verifyBody, authMiddleware.uniqueEmail],
  async (req, res) => {
    const study_id = req.params.study_id;
    if (!isValidObjectId(study_id)) {
      return res.status(404).json({
        ok: false,
        message: "Study doesn't exist!",
      });
    }

    // Find student role
    const role = await Role.findOne({ name: "student" }, (err) => {
      if (err) {
        return res.status(404).json({
          ok: false,
          err,
        });
      }
    });

    // Find study
    const study = await Study.findOne({ _id: study_id }, (err) => {
      if (err) {
        return res.status(404).json({
          ok: false,
          err,
        });
      }
    });

    // Find study challenges
    const challenges = await Challenge.find({ study: study }, (err) => {
      if (err) {
        return res.status(404).json({
          ok: false,
          err,
        });
      }
    });

    if (!study) {
      return res.status(404).json({
        ok: false,
        message: "STUDY_NOT_FOUND_ERROR",
      });
    }

    //create userData
    const userData = new UserData({
      email: req.body.email,
      tutor_names: req.body.tutor_names,
      tutor_last_names: req.body.tutor_last_names,
      tutor_phone: req.body.tutor_phone,
      names: req.body.names,
      last_names: req.body.last_names,
      birthday: req.body.birthday,
      sex: req.body.sex,
      course: req.body.course,
      institution: req.body.institution,
      institution_commune: req.body.institution_commune,
      institution_region: req.body.institution_region,
      relation: req.body.relation,
      registered_via: req.body.registered_via
    });          

    //save userData in db
    userData.save((err, userData) => {
      if (err) {
        return res.status(404).json({
          ok: false,
          err
        })
      }
    });
    
    //hash password
    const salt = await bcrypt.genSalt(10);
    const hashpassword = await bcrypt.hash(req.body.password, salt);

    //create user
    const user = new User({
      email: req.body.email,
      names: req.body.names,
      password: hashpassword,
      role: role._id,
      study: study._id,
      registered_via: req.body.registered_via
    });

    //save user in db
    user.save((err, user) => {
      if (err) {
        return res.status(404).json({
          ok: false,
          err,
        });
      }

      // Generate user study progress entry
      generateProgress(challenges, user, study)
        .catch((err) => {
          return res.status(404).json({
            ok: false,
            err,
          });
        })
        .then((progress) => {
          // Register player in NEURONE-GM
          saveGMPlayer(req, user, study, res);

          // Send confirmation email
          sendConfirmationEmail(user, userData, res, req);

          res.status(200).json({
            user,
          });
        });
    });
  }
);

router.post(
  "/registerDummy/:study_id",
  [authMiddleware.verifyBodyAdmin, authMiddleware.uniqueEmail],
  async (req, res) => {
    const study_id = req.params.study_id;
    if (!isValidObjectId(study_id)) {
      return res.status(404).json({
        ok: false,
        message: "Study doesn't exist!",
      });
    }

    // Find student role
    const role = await Role.findOne({ name: "student" }, (err) => {
      if (err) {
        return res.status(404).json({
          ok: false,
          err,
        });
      }
    });

    // Find study
    const study = await Study.findOne({ _id: study_id }, (err) => {
      if (err) {
        return res.status(404).json({
          ok: false,
          err,
        });
      }
    });

    // Find study challenges
    const challenges = await Challenge.find({ study: study }, (err) => {
      if (err) {
        return res.status(404).json({
          ok: false,
          err,
        });
      }
    });

    if (!study) {
      return res.status(404).json({
        ok: false,
        message: "STUDY_NOT_FOUND_ERROR",
      });
    }
    
    //hash password
    const salt = await bcrypt.genSalt(10);
    const hashpassword = await bcrypt.hash(req.body.password, salt);

    //create user
    const user = new User({
      email: req.body.email,
      names: req.body.names,
      password: hashpassword,
      confirmed: true,
      role: role._id,
      study: study._id,
    });

    //save user in db
    user.save((err, user) => {
      if (err) {
        return res.status(404).json({
          ok: false,
          err,
        });
      }

      // Generate user study progress entry
      generateProgress(challenges, user, study)
        .catch((err) => {
          return res.status(404).json({
            ok: false,
            err,
          });
        })
        .then((progress) => {
          // Register player in NEURONE-GM
          saveGMPlayer(req, user, study, res);

          res.status(200).json({
            user,
          });
        });
    });
  }
);

router.post("/login", async (req, res) => {
  //checking if username exists
  const user = await User.findOne(
    {email: req.body.email.toLowerCase()}, err => {
    if(err){
      res.status(400).send(err)
    }
  }).populate( { path: 'role', model: Role} );
  if (!user) return res.status(400).send("EMAIL_NOT_FOUND");
  //checking password
  const validPass = await bcrypt.compare(req.body.password, user.password);
  if (!validPass) return res.status(400).send("INVALID_PASSWORD");
  //check if user is confirmed
  if (!user.confirmed) return res.status(400).send("USER_NOT_CONFIRMED");
  //create and assign a token
  const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET, { expiresIn: '12h' });
  res.header("x-access-token", token).send({ user: user, token: token });
});

router.post(
  "/registerMultiple/:study_id",
  [authMiddleware.verifyBodyMultiple, authMiddleware.uniqueEmailMultiple],
  async (req, res) => {
    const study_id = req.params.study_id;

    if (!isValidObjectId(study_id)) {
      return res.status(404).json({
        ok: false,
        message: "STUDY_NOT_FOUND_ERROR"
      });
    }

    /*Find student role*/
    const role = await Role.findOne({ name: "student" }, (err) => {
      if (err) {
        return res.status(404).json({
          ok: false,
          err
        });
      }
    });

    /*Find study*/
    const study = await Study.findOne({ _id: study_id }, (err) => {
      if (err) {
        return res.status(404).json({
          ok: false,
          err
        });
      }
    });

    /*Find study challenges*/
    const challenges = await Challenge.find({ study: study }, (err) => {
      if (err) {
        return res.status(404).json({
          ok: false,
          err
        });
      }
    });

    if (!study) {
      return res.status(404).json({
        ok: false,
        message: "STUDY_NOT_FOUND_ERROR"
      });
    }

    createDirIfNotExists("public/" + req.body.paramAdminId);
    const momento = Date.now();
    const fileName =
      "public/" +
      req.body.paramAdminId +
      "/" +
      study .name +
      "_" +
      momento +
      ".csv";
    fs.writeFileSync(
      fileName,
      JSON.stringify("email" + "," + "password") + "\n",
      (err) => {
        if (err) {
          throw err;
        }
      }
    );

    for (
      let i = 0 + req.body.paramStart;
      i < req.body.paramUsers + req.body.paramStart;
      i++
    ) {
      let id = "";
      if (i < 10) {
        id += "00" + i;
      } else if (i >= 10 && i < 100) {
        id += "0" + i;
      } else {
        id += i;
      }

      let email = (req.body.paramEmailPrefix + id + '@' + req.body.paramEmailSubfix).toLowerCase();
      let password = Math.floor(1000 + Math.random() * 9000) + "";

      /*create userData*/
      const userData = new UserData({
        email: email,
        tutor_names: "NombreTutor",
        tutor_last_names: "ApellidoTutor",
        tutor_phone: null,
        names: req.body.paramName + id,
        last_names: ".",
        birthday: new Date(req.body.paramBirthdayYear).toUTCString(),
        course: req.body.paramCourse,
        institution: req.body.paramInstitution,
        institution_commune: req.body.paramCommune,
        institution_region: req.body.paramRegion,
        relation: "Tutor"
      });

      /*save userData in DB*/
      userData.save((err, userData) => {
        if (err) {
          return res.status(404).json({
            ok: false,
            err
          });
        }
      });

      /*Hash password*/
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);

      /*Create user*/
      const user = new User({
        email: email,
        names: req.body.paramName,
        password: hashPassword,
        role: role._id,
        study: study._id,
        confirmed: true
      });

      /*Save user in DB*/
      user.save((err, user) => {
        if (err) {
          return res.status(404).json({
            ok: false,
            err
          });
        }

        /*Generate user study progress entry*/
        generateProgress(challenges, user, study)
          .catch((err) => {
            return res.status(404).json({
              ok: false
            });
          })
          .then((progress) => {
            /*Send confirmation email*/
            //            sendConfirmationEmail(user, userData, res, req);
          });

        fs.appendFile(
          fileName,
          JSON.stringify(user.email + "," + password) + "\n",
          (err) => {
            if (err) {
              throw err;
            }
          }
        );
      });
    }

    return res.status(200).json({
      message: "REGISTER_MULTIPLE_SUCCESS",
      nombre: study.name + "_" + momento + ".csv"
    });
  }
);

function createDirIfNotExists(dir) {
  !fs.existsSync(dir) ? fs.mkdirSync(dir, { recursive: true }) : undefined;
}

router.get(
  "/getUserFiles/:user_id",
  [verifyToken, authMiddleware.isAdmin],
  async (req, res) => {
    const files = fs.readdirSync("public/" + req.params.user_id);

    return res.status(200).json({
      files: files
    });
  }
);

module.exports = router;
