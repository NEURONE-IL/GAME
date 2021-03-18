const express = require('express');
const router = express.Router();
const Challenge = require('../models/challenge');
const User = require('../models/user');
const UserChallenge = require('../models/userChallenge');
const GameElement = require('../models/gameElement');
const levenshtein = require('../node_modules/js-levenshtein');
const normalize = require('../node_modules/normalize-diacritics');

const pointService = require('../services/neuronegm/point');
const actionService = require('../services/neuronegm/action');
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
    }).populate({ path: 'user', model: User} , {password:0}).populate({ path: 'challenge', model: Challenge} );
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
    }).populate({ path: 'challenge', model: Challenge} ).populate({ path: 'user', model: User} , {password:0});
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
    const user = await User.findOne({_id: req.body.user});
    const pointElement = await GameElement.findOne({key: 'exp_1'});
    const answerAction = await GameElement.findOne({key: 'responder_pregunta_1'});
    const noHintsAction = await GameElement.findOne({key: 'sin_pistas_1'});
    let distance = await normalizeAndDistance(challenge.answer.toLowerCase(), req.body.answers[0].answer.toLowerCase());
    let pointsObtained = await calculatePoints(distance);
    const userChallenge = new UserChallenge({
        user: req.body.user,
        challenge: challenge._id,
        date: req.body.date,
        answers: req.body.answers,
        hintUsed: req.body.hintUsed,
        timeLeft: req.body.timeLeft,
        distance: distance,
        pointsObtained: pointsObtained
    })
    userChallenge.save((err, userChallenge) => {
        if (err) {
            return res.status(404).json({
                err
            });
        }
        if(user && user.gm_code && pointElement){
            let post =  {point_code: pointElement.gm_code, date: userChallenge.createdAt, amount: pointsObtained};
            pointService.givePoints(post, user.gm_code, (err, data) => {
                if(err){
                    console.log(err);
                }
            });
        }
        if(user && user.gm_code && answerAction){
            let post =  {action_code: answerAction.gm_code, date: userChallenge.createdAt};
            actionService.postPlayerAction(post, user.gm_code, (err, data) => {
                if(err){
                    console.log(err);
                }
                res.status(200).json({
                    user
                });
            });
        }
        if(user && user.gm_code && noHintsAction){
            let post =  {action_code: noHintsAction.gm_code, date: userChallenge.createdAt};
            actionService.postPlayerAction(post, user.gm_code, (err, data) => {
                if(err){
                    console.log(err);
                }
                res.status(200).json({
                    user
                });
            });
        }
        res.status(200).json({
            userChallenge
        });
    })
})

router.get('/last-answer', verifyToken, async (req, res)=> {
    const user_id = req.body.user;
    UserChallenge({user: user_id}, (err, last_answer) => {
        if (err) {
            return res.status(404).json({
                err
            });
        }
        res.status(200).json({
            last_answer
        });
    }).sort({createdAt: -1});
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

async function calculatePoints(distance){
    let base = 100;
    if(distance >= 16){
        return 20
    }
    else{
        return base-distance*5;
    }
}

module.exports = router;