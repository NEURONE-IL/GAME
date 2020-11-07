const express = require('express');
const router = express.Router();
const Study = require('../models/study');

const authMiddleware = require('../middlewares/authMiddleware');
const studyMiddleware = require('../middlewares/studyMiddleware');
const verifyToken = require('../middlewares/verifyToken');

router.get('' , async (req, res) => {
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

router.get('/:study_id', async (req, res) => {
    const _id = req.params.study_id;
    Study.findOne({_id: _id}, (err, study) =>{
        if(err){
            return res.status(404).json({
                ok: false,
                err
            });
        }
        res.status(200).json({study});
    });
});

router.post('',  [verifyToken, authMiddleware.isAdmin, studyMiddleware.verifyBody], async (req, res) => {
    const study = new Study({
        name: req.body.name
    });
    if(req.body.description){
        study.description = req.body.description;
    }
    study.save((err, study) => {
        if (err) {
            return res.status(404).json({
                err
            });
        }
        res.status(200).json({
            study
        });
    })
});

router.put('/:study_id', [verifyToken, authMiddleware.isAdmin, studyMiddleware.verifyEditBody], async (req, res) => {
    const _id = req.params.study_id;
    const study = await Study.findOne({_id: _id}, (err, study) => {
        if (err) {
            return res.status(404).json({
                err
            });
        }
        if(req.body.name){
            study.name = req.body.name;
        }
        if(req.body.description){
            study.description = req.body.description;
        }
        study.updatedAt = Date.now();
        study.save((err, study) => {
            if (err) {
                return res.status(404).json({
                    err
                });
            }
            res.status(200).json({
                study
            });
        })
    })
})

router.delete('/:study_id',  [verifyToken, authMiddleware.isAdmin] , async (req, res) => {
    const _id = req.params.study_id;
    Study.deleteOne({_id: _id}, (err, study) => {
        if (err) {
            return res.status(404).json({
                err
            });
        }
        res.status(200).json({
            study
        });
    })
})


module.exports = router;