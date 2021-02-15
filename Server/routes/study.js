const express = require('express');
const router = express.Router();

const imageStorage = require('../middlewares/imageStorage');

const Study = require('../models/study');
const Challenge = require('../models/challenge');

const authMiddleware = require('../middlewares/authMiddleware');
const studyMiddleware = require('../middlewares/studyMiddleware');
const verifyToken = require('../middlewares/verifyToken');
const groupService = require('../services/neuronegm/group');

router.get('' ,  [verifyToken], async (req, res) => {
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

router.get('/:study_id/getForSignup', async (req, res) => {
    const _id = req.params.study_id;
    Study.findOne({_id: _id}, (err, study) =>{
        if(err){
            return res.status(404).json({
                ok: false,
                err
            });
        }
        if(study!=null) {
            if('published' in study) {
                if(!published) {
                    return res.status(500).json({
                        ok: false,
                        msg: "STUDY_NOT_PUBLISHED"
                    });
                }
            }
            Challenge.find({study: study.id}, (err, challenges) => {
                if(err) {
                    return res.status(404).json({
                        ok: false,
                        err
                    });
                }
                if(challenges.length<1) {
                    return res.status(500).json({
                        ok: false,
                        msg: "NO_CHALLENGES_IN_STUDY"
                    });
                }
                res.status(200).json({study:study});
            });
        }
        else {
            return res.status(404).json({
                ok: false,
                msg: "STUDY_NOT_FOUND"
            });
        }
    });
});

router.post('',  [verifyToken, authMiddleware.isAdmin,  imageStorage.upload.single('file'), studyMiddleware.verifyBody], async (req, res) => {
    let cooldown = req.body.hours*3600 + req.body.minutes*60 + req.body.seconds;
    const study = new Study({
        name: req.body.name,
        domain: req.body.domain,
        cooldown: cooldown
    });
    if(req.body.description){
        study.description = req.body.description;
    }
    if(req.file){
        let image_url = '/api/image/'+req.file.filename;
        study.image_url = image_url;
        study.image_id = req.file.id;
    }
    console.log(req.file)
    study.save((err, study) => {
        if (err) {
            return res.status(404).json({
                err
            });
        }
        groupService.postGroup({name: req.body.name, sourceId: study._id }, (err, data) => {
            if(err){
                res.status(200).json({
                    study
                });
            }
            else{
                study.gm_code = data.code;
                study.save(err => {
                    if(err){
                        return res.status(404).json({
                            ok: false,
                            err
                        });
                    }
                    res.status(200).json({
                        study
                    });
                })
            }
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
        if(req.body.hours && req.body.minutes && req.body.seconds ){
            study.cooldown = req.body.hours*3600 + req.body.minutes*60 + req.body.seconds;
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