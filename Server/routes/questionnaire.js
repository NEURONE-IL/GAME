const express = require('express');
const router = express.Router();
const Questionnaire = require('../models/questionnaire');
const UserQuestionnaire = require('../models/userQuestionnaire');

const authMiddleware = require('../middlewares/authMiddleware');
const questionnaireMiddleware = require('../middlewares/questionnaireMiddleware');
const verifyToken = require('../middlewares/verifyToken');

router.get('', [verifyToken], async (req, res) => {
    Questionnaire.find({}, (err, questionnaires) =>{
        if(err){
            return res.status(404).json({
                ok: false,
                err
            });
        }
        res.status(200).json({questionnaires});
    });
})

router.get('/answer', [verifyToken], async (req, res) => {
    UserQuestionnaire.find({}, (err, userQuestionnaires) =>{
        if(err){
            return res.status(404).json({
                ok: false,
                err
            });
        }
        res.status(200).json({userQuestionnaires});
    }).populate({ path: 'user', model: User} , {password:0}).populate({ path: 'questionnaire', model: Questionnaire} );
})

router.get('/:questionnaire_id', [verifyToken], async (req, res) => {
    const _id = req.params.questionnaire_id;
    Questionnaire.findOne({_id: _id}, (err, questionnaire) =>{
        if(err){
            return res.status(404).json({
                ok: false,
                err
            });
        }
        res.status(200).json({questionnaire});
    });
});

router.get('/byType/:type', [verifyToken], async (req, res) => {
    const type = req.params.type;
    Questionnaire.find({type}, (err, questionnaires) => {
        if(err){
            return res.status(404).json({
                ok: false,
                err
            });
        }
        res.status(200).json({questionnaires});
    })
});

router.get('/answer/:answers_id', [verifyToken], async (req, res) => {
    const _id = req.params.answers_id;
    UserQuestionnaire.findOne({_id: _id}, (err, userQuestionnaire) =>{
        if(err){
            return res.status(404).json({
                ok: false,
                err
            });
        }
        res.status(200).json({userQuestionnaire});
    }).populate({ path: 'questionnaire', model: Questionnaire} ).populate({ path: 'user', model: User} , {password:0});
})

router.post('',  [verifyToken, authMiddleware.isAdmin, questionnaireMiddleware.verifyBody], async (req, res) => {
    const questionnaire = new Questionnaire({
        name: req.body.name,
        type: req.body.type,
        questions: req.body.questions
    });

    questionnaire.save((err, questionnaire) => {
        if (err) {
            return res.status(404).json({
                err
            });
        }
        res.status(200).json({
            questionnaire
        });
    })
});

router.post('/answer', [verifyToken, questionnaireMiddleware.verifyAnswerBody], async (req, res)=> {
    const questionnaire = await Questionnaire.findOne({_id: req.body.questionnaire}, err => {
        if (err) {
            return res.status(404).json({
                err
            });
        }
    })
    if(questionnaire === null){
        return res.status(404).json({
            ok: false,
            message: "Questionnaire doesn't exist!"
        });
    }
    const userQuestionnaire = new UserQuestionnaire({
        user: req.body.user,
        questionnaire: questionnaire._id,
        challenge: req.body.challenge,
        type: questionnaire.type,
        answers: req.body.answers
    })
    userQuestionnaire.save((err, userQuestionnaire) => {
        if (err) {
            return res.status(404).json({
                err
            });
        }
        res.status(200).json({
            userQuestionnaire
        });
    })
})

router.put('/:questionnaire_id', [verifyToken, authMiddleware.isAdmin, questionnaireMiddleware.verifyEditBody], async (req, res) => {
    const _id = req.params.questionnaire_id;
    await Questionnaire.findOne({_id: _id}, (err, questionnaire) => {
        if (err) {
            return res.status(404).json({
                err
            });
        }
        if(req.body.name){
            questionnaire.name = req.body.name;
        }
        if(req.body.description){
            questionnaire.description = req.body.description;
        }
        if(req.body.questions){
            questionnaire.questions = req.body.questions;
        }
        questionnaire.updatedAt = Date.now();
        questionnaire.save((err, questionnaire) => {
            if (err) {
                return res.status(404).json({
                    err
                });
            }
            res.status(200).json({
                questionnaire
            });
        })
    })
})

router.delete('/:questionnaire_id',  [verifyToken, authMiddleware.isAdmin] , async (req, res) => {
    const _id = req.params.questionnaire_id;
    Questionnaire.deleteOne({_id: _id}, (err, questionnaire) => {
        if (err) {
            return res.status(404).json({
                err
            });
        }
        res.status(200).json({
            questionnaire
        });
    })
})

router.delete('/answer/:answer_id',  [verifyToken, authMiddleware.isAdmin] , async (req, res) => {
    const _id = req.params.answer_id;
    UserQuestionnaire.deleteOne({_id: _id}, (err, userQuestionnaire) => {
        if (err) {
            return res.status(404).json({
                err
            });
        }
        res.status(200).json({
            userQuestionnaire
        });
    })
})


module.exports = router;