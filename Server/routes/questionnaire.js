const express = require('express');
const router = express.Router();
const Questionnaire = require('../models/questionnaire');
const Study = require('../models/study');

const authMiddleware = require('../middlewares/authMiddleware');
const questionnaireMiddleware = require('../middlewares/questionnaireMiddleware');
const verifyToken = require('../middlewares/verifyToken');

router.get('', [verifyToken, authMiddleware.isAdmin] , async (req, res) => {
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

router.get('/:questionnaire_id', [verifyToken, authMiddleware.isAdmin] , async (req, res) => {
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

router.post('',  [verifyToken, authMiddleware.isAdmin, questionnaireMiddleware.verifyBody], async (req, res) => {
    const questionnaire = new Questionnaire({
        name: req.body.name,
        type: req.body.type,
        questions: req.body.questions
    });
    if(req.body.study){
        if(!isValidObjectId(study_id)){
            return res.status(404).json({
                ok: false,
                message: "Study doesn't exist!"
            });
        }
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
        questionnaire.study = study._id;
    }

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

router.put('/:questionnaire_id', [verifyToken, authMiddleware.isAdmin, questionnaireMiddleware.verifyEditBody], async (req, res) => {
    const _id = req.params.questionnaire_id;
    const study = null;
    if(req.body.study){
        if(!isValidObjectId(study_id)){
            return res.status(404).json({
                ok: false,
                message: "Study doesn't exist!"
            });
        }
        study = await Study.findOne({_id: study_id}, err => {
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
    }
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
        if(req.body.study){
            questionnaire.study = study._id;
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


module.exports = router;