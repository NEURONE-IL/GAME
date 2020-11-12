const express = require('express');
const router = express.Router();
const Challenge = require('../models/challenge');

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
        if(req.body.seconds){
            challenge.seconds = req.body.seconds;
        }
        if(req.body.domain){
            challenge.domain = req.body.domain;
        }
        if(req.body.locale){
            challenge.locale = req.body.locale;
        }
        if(req.body.task){
            challenge.task = req.body.task;
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


module.exports = router;