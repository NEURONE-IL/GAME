const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Role = require('../models/role');
const Study = require('../models/study');
const Challenge = require('../models/challenge');
const Credential = require('../models/credential');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const neuronegmService = require('../services/neuronegm/connect');
const actionService = require('../services/neuronegm/action');
const pointService = require('../services/neuronegm/point');
const badgeService = require('../services/neuronegm/badge');
const levelService = require('../services/neuronegm/level');
const challengeService = require('../services/neuronegm/challenge');
const leaderboardService = require('../services/neuronegm/leaderboard');
const playerService = require('../services/neuronegm/player');

const authMiddleware = require('../middlewares/authMiddleware');
const { isValidObjectId, connect } = require('mongoose');

router.post('/testxd', async(req, res) => {
    playerService.postPlayer({name: 'testa', last_name: 'testa', sourceId: 'xddaasda'}, (err, data) => {
        if(err){
            console.log(err)
        }
        res.status(200).json({
            data
        });
    })
})

router.post('/register', [authMiddleware.verifyBodyAdmin, authMiddleware.uniqueEmail], async (req, res) => {
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
        email: req.body.email,
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

router.get('/gamify', async (req, res) => {
    let credential = await Credential.findOne({code: "superadmin"}, err => {
        if(err){
            return res.status(404).json({
                ok: false,
                err
            });
        }
    })
    if(credential && !credential.gamified){
        await actionService.postAllActions(err => {
            if(err){
                return res.status(404).json({
                    ok: false,
                    err
                });
            }
        });
        await pointService.postAllPoints(err => {
            if(err){
                return res.status(404).json({
                    ok: false,
                    err
                });
            }
        });
        await badgeService.postAllBadges(err => {
            if(err){
                return res.status(404).json({
                    ok: false,
                    err
                });
            }
        })
        res.status(200).send("OK");
    }
    else{
        res.status(400).send("Can't gamify!");
    }
})

router.get('/gamifyDependent', async (req, res) => {
    let credential = await Credential.findOne({code: "superadmin"}, err => {
        if(err){
            return res.status(404).json({
                ok: false,
                err
            });
        }
    })
    if(credential && !credential.gamified){
        await levelService.postAllLevels(err => {
            if(err){
                return res.status(404).json({
                    ok: false,
                    err
                });
            }
        });
        await challengeService.postAllChallenges(err => {
            if(err){
                return res.status(404).json({
                    ok: false,
                    err
                });
            }
        });
        await leaderboardService.postAllLeaderboards(err => {
            if(err){
                return res.status(404).json({
                    ok: false,
                    err
                });
            }
        })
        credential.gamified = true;
        await credential.save(err=> {
            if(err){
                return res.status(404).json({
                    ok: false,
                    err
                });
            }
        })
        res.status(200).send("OK");
    }
    else{
        res.status(400).send("Can't gamify!");
    }
})


router.post('/register/:study_id', [authMiddleware.verifyBody, authMiddleware.uniqueEmail], async (req, res)=>{
    const study_id = req.params.study_id;
    if(!isValidObjectId(study_id)){
        return res.status(404).json({
            ok: false,
            message: "Study doesn't exist!"
        });
    }
    const role = await Role.findOne({name: 'student'}, err => {
        if(err){
            return res.status(404).json({
                ok: false,
                err
            });
        }
    });
    const study = await Study.findOne({_id: study_id}, err => {
        if(err){
            return res.status(404).json({
                ok: false,
                err
            });
        }
    })
    if(!study){
        return res.status(404).json({
            ok: false,
            message: "Study doesn't exist!"
        });
    }
    //hash password
    const salt = await bcrypt.genSalt(10);
    const hashpassword = await bcrypt.hash(req.body.password, salt);
    const challenges = await Challenge.find({study: study}, err => {
        if(err){
            return res.status(404).json({
                ok: false,
                err
            });
        }
    })
    //create user
    const user = new User({
        email: req.body.email,
        tutor_names: req.body.tutor_names,
        tutor_last_names: req.body.tutor_last_names,
        tutor_rut: req.body.tutor_rut,
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
        challenges_progress: generateProgressArray(challenges)
    });
    //save user in db
    user.save((err, user) => {
        if(err){
            return res.status(404).json({
                ok: false,
                err
            });
        }
        playerService.postPlayer({name: req.body.names, last_name: req.body.last_names, sourceId: user._id }, (err, data) => {
            if(err){
                console.log(err);
                res.status(200).json({
                    user
                });
            }
            else{
                user.gm_code = data.code;
                user.save(err => {
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
            }
        });
    })
    
});

router.post('/login', async (req, res) => {
    //checking if username exists
    const user = await User.findOne({ email: req.body.email }).populate('role');
    if(!user) res.status(400).send('Email is not found!');
    //checking password
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if(!validPass) res.status(400).send('Invalid password!');
    //create and assign a token
    const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET);
    res.header('x-access-token', token).send({user: user, token: token});
})

function generateChallengeSequence(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
  
    while (0 !== currentIndex) {
  
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
  
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    return array;
  }

  function generateProgressArray(challenges) {
    const sequence = generateChallengeSequence(challenges);
    let progress = [];
    sequence.forEach(challenge => {
        progress.push({
            challenge: challenge
        });
    });
    return progress;
  }



module.exports = router;