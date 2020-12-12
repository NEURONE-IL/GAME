const express = require('express');
const router = express.Router();
const Challenge = require('../models/challenge');
const UserChallenge = require('../models/userChallenge');
const levenshtein = require('../node_modules/js-levenshtein');
const normalize = require('../node_modules/normalize-diacritics');

const authMiddleware = require('../middlewares/authMiddleware');
const challengeMiddleware = require('../middlewares/challengeMiddleware');
const verifyToken = require('../middlewares/verifyToken');

router.get('', [verifyToken] , async (req, res) => {
    Challenge.find({}, (err, challenges) =>{
        if(err){
            return res.status(404).json({
                ok: false,
                err
            });
        }
        res.status(200).json({challenges});
    });
})

router.get('/:challenge_id', [verifyToken] , async (req, res) => {
    const _id = req.params.challenge_id;
    Challenge.findOne({_id: _id}, (err, challenge) =>{
        if(err){
            return res.status(404).json({
                ok: false,
                err
            });
        }
        res.status(200).json({challenge});
    });
});

router.get('/answer/all', [verifyToken], async (req, res) => {
    UserChallenge.find({}, (err, userChallenges) =>{
        if(err){
            return res.status(404).json({
                ok: false,
                err
            });
        }
        res.status(200).json({userChallenges});
    }).populate('user', {password:0}).populate('challenge');
})

router.get('/byStudy/:study_id', [verifyToken], async (req, res) => {
    const _id = req.params.study_id;
    Challenge.find({study: _id}, (err, challenges) => {
        if(err){
            return res.status(404).json({
                ok: false,
                err
            });
        }
        res.status(200).json({challenges});
    })
});

router.get('/answer/byId/:answers_id', [verifyToken], async (req, res) => {
    const _id = req.params.answers_id;
    UserChallenge.findOne({_id: _id}, (err, userChallenges) =>{
        if(err){
            return res.status(404).json({
                ok: false,
                err
            });
        }
        res.status(200).json({userChallenges});
    }).populate('challenge').populate('user', {password:0});
})

router.post('',  [verifyToken, authMiddleware.isAdmin, challengeMiddleware.verifyBody], async (req, res) => {
    const challenge = new Challenge(req.body);
    challenge.save((err, challenge) => {
        if (err) {
            return res.status(404).json({
                err
            });
        }
        res.status(200).json({
            challenge
        });
    })
});

router.post('/answer', [verifyToken, challengeMiddleware.verifyAnswerBody], async (req, res)=> {
    const _id = req.body.challenge;
    const challenge = await Challenge.findOne({_id: _id});
    let distance = await normalizeAndDistance(challenge.answer.toLowerCase(), req.body.answers[0].answer.toLowerCase())
    const userChallenge = new UserChallenge({
        user: req.body.user,
        challenge: challenge,
        date: req.body.date,
        answers: req.body.answers,
        hintUsed: req.body.hintUsed,
        timeLeft: req.body.timeLeft,
        pointsObtained: distance
    })
    userChallenge.save((err, userChallenge) => {
        if (err) {
            return res.status(404).json({
                err
            });
        }
        res.status(200).json({
            userChallenge
        });
    })
})

router.put('/:challenge_id', [verifyToken, authMiddleware.isAdmin, challengeMiddleware.verifyEditBody], async (req, res) => {
    const _id = req.params.challenge_id;
    const challenge = await Challenge.findOne({_id: _id}, (err, challenge) => {
        if (err) {
            return res.status(404).json({
                err
            });
        }
        if(req.body.question){
            challenge.question = req.body.question;
        }
        if(req.body.question_type){
            challenge.question_type = req.body.question_type;
        }        
        if(req.body.seconds){
            challenge.seconds = req.body.seconds;
        }
        if(req.body.number){
            challenge.number = req.body.number;
        }
        if(req.body.hint){
            challenge.hint = req.body.hint;
        }
        if(req.body.answer_type){
            challenge.answer_type = req.body.answer_type;
        }
        if(req.body.study){
            challenge.study = req.body.study;
        }
        if(req.body.answer){
            challenge.answer = req.body.answer;
        }
        if(req.body.max_attempts){
            challenge.max_attempts = req.body.max_attempts;
        }
        challenge.updatedAt = Date.now();
        challenge.save((err, challenge) => {
            if (err) {
                return res.status(404).json({
                    err
                });
            }
            res.status(200).json({
                challenge
            });
        })
    })
})

router.delete('/:challenge_id',  [verifyToken, authMiddleware.isAdmin] , async (req, res) => {
    const _id = req.params.challenge_id;
    Challenge.deleteOne({_id: _id}, (err, challenge) => {
        if (err) {
            return res.status(404).json({
                err
            });
        }
        res.status(200).json({
            challenge
        });
    })
})

router.delete('/answer/:answer_id',  [verifyToken, authMiddleware.isAdmin] , async (req, res) => {
    const _id = req.params.answer_id;
    UserChallenge.deleteOne({_id: _id}, (err, userChallenge) => {
        if (err) {
            return res.status(404).json({
                err
            });
        }
        res.status(200).json({
            userChallenge
        });
    })
})

async function normalizeAndDistance(answer, userAnswer) {
    let normalizedAnswer = await normalize.normalize(answer);
    let normalizedUserAnswer = await normalize.normalize(userAnswer);
    console.log(normalizedAnswer, normalizedUserAnswer);
    var distance = levenshtein(normalizedAnswer, normalizedUserAnswer);
    return distance;
}

module.exports = router;