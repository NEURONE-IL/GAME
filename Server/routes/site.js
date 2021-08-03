const express = require("express");
const Site = require("../models/site");
const User = require("../models/user");
const Role = require("../models/role");
const Challenge = require("../models/challenge");
const verifyAPIKey = require('../middlewares/verifyAPIKey');
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const {
  generateProgress,
  saveGMPlayer
} = require("../utils/routeUtils");
const Study = require("../models/study");

const genKey = () => {
    return [...Array(30)]
        .map((e) => ((Math.random() * 36 | 0).toString(36)))
        .join('');
}

router.post(
  "/register",
  async (req, res) => {
    console.log(req.headers.origin);
    const siteExists = await Site.findOne({host: req.headers.origin}, err => {
      if(err){
        return res.status(404).json({
          ok: false,
          err
        });   
      }
    })
    if(siteExists){
      res.status(200).json({
        site: siteExists
      });
    }
    else{
      const site = new Site({
        host: req.headers.origin,
        api_key: genKey(),
        confirmed: false
      });
      site.save((err, site)=> {
        if(err){
            return res.status(404).json({
                ok: false,
                err,
              });   
        }
        res.status(200).json({
            site
        });
      })
    }
  }
);

router.post("/registeruser", verifyAPIKey, async (req, res) => {
    const url = req.body.url;
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
    const study = await Study.findOne({ _id: req.body.study }, (err) => {
      if (err) {
        return res.status(404).json({
          ok: false,
          err,
        });
      }
    });
    // Find study challenges
    const challenges = await Challenge.find({ study: study._id }, (err) => {
      if (err) {
        return res.status(404).json({
          ok: false,
          err,
        });
      }
    });
    console.log(challenges)
    const salt = await bcrypt.genSalt(10);
    const hashpassword = await bcrypt.hash(genKey(), salt);
    const user = new User({
        email: req.body.email,
        names: req.body.names,
        password: hashpassword,
        role: role._id,
        study: study._id,
        trainer_id: req.body.trainer_id,
        confirmed: true
    });
    await user.save(err => {
        if(err){
          return res.status(404).json({
            ok: false,
            err,
          });   
        }
    })
    const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
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

        res.header("x-access-token", token).send({ user: user, token: token, url: url });
    });
})

router.post("/login", verifyAPIKey, async (req, res) => {
    const url = req.body.url;
    //checking if username exists
    const user = await User.findOne({
      trainer_id: req.body.trainer_id,
    }, err => {
      if(err){
        res.status(400).send(err)
      }
    }).populate( { path: 'role', model: Role} );
    if (!user) res.status(400).send("ID_NOT_FOUND");
    const study = await Study.findOne({_id: req.body.study}, err => {
      if(err){
        res.status(400).send(err)
      }
    })
    user.cooldown_start = null;
    user.interval_answers = 0;
    if(user.study !== study._id){
      user.study = study._id;
    }
    await user.save(err => {
      if(err){
        res.status(400).send(err)
      }
    });
    //create and assign a token
    const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
    res.header("x-access-token", token).send({ user: user, token: token, url: url });
  });

router.get("/study", verifyAPIKey, async (req, res) => {
  Study.find({}, (err, studys) =>{
    if(err){
        return res.status(404).json({
            ok: false,
            err
        });
    }
    res.status(200).json({studys});
  });
})

router.get("/user/:trainer_id", async (req, res) => {
  const trainer_id = req.params.trainer_id;
  const user = await User.findOne({trainer_id: trainer_id}, err => {
    if(err){
      res.status(400).send(err)
    }
  })
  res.status(200).json({
    ok: true,
    user
  });
})


module.exports = router;
