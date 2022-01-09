const express = require('express');
const router = express.Router();

const imageStorage = require('../middlewares/imageStorage');

const Study = require('../models/study');
const Challenge = require('../models/challenge');
const UserStudy = require('../models/userStudy');
const User = require('../models/user');
const SessionLog = require('../models/sessionLog');
const StudyAssistant = require('../models/studyAssistant');

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

router.get('/:study_id/copy', [verifyToken], async (req, res) => {
    const _id = req.params.study_id;
    const study = await Study.findOne({_id: _id}, err => {
        if (err) {
            return res.status(404).json({
                err
            });
        }
    });
    const challenges = await Challenge.find({study: study._id}, err => {
        if (err) {
            return res.status(404).json({
                err
            });
        }
    })
    const copy = new Study({
        name: study.name+' (copy)',
        description: study.description,
        domain: study.domain,
        max_per_interval: study.max_per_interval,
        cooldown: study.cooldown,
        image_id: study.image_id,
        image_url: study.image_url
    });
    for(let i = 0; i<challenges.length; i++){
        let newChallenge = new Challenge({
            question: challenges[i].question,
            question_type: challenges[i].question_type,
            number: challenges[i].number,
            seconds: challenges[i].seconds,
            hint: challenges[i].hint,
            answer_type: challenges[i].answer_type,
            answer: challenges[i].answer,
            max_attempts: challenges[i].max_attempts,
            study: copy._id,
        })
        await newChallenge.save(err => {
            if(err){
                return res.status(404).json({
                    err
                });
            }
        })
    }
    copy.save((err, copy) => {
        if (err) {
            return res.status(404).json({
                err
            });
        }
        groupService.postGroup({name: copy.name, sourceId: copy._id }, (err, data) => {
            if(err){
                res.status(200).json({
                    copy
                });
            }
            else{
                copy.gm_code = data.code;
                copy.save(err => {
                    if(err){
                        return res.status(404).json({
                            ok: false,
                            err
                        });
                    }
                    res.status(200).json({
                        copy
                    });
                })
            }
        });
    })
})

router.post('',  [verifyToken, authMiddleware.isAdmin,  imageStorage.upload.single('file'), studyMiddleware.verifyBody], async (req, res) => {
    let cooldown = req.body.hours*3600 + req.body.minutes*60;
    const study = new Study({
        name: req.body.name,
        domain: req.body.domain,
        max_per_interval: 1,
        cooldown: cooldown
    });
    if(req.body.max_per_interval){
        study.max_per_interval = req.body.max_per_interval;
    }
    if(req.body.description){
        study.description = req.body.description;
    }
    if(req.file){
        let image_url = process.env.ROOT+'/api/image/'+req.file.filename;
        study.image_url = image_url;
        study.image_id = req.file.id;
    }
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

router.put('/:study_id', [verifyToken, authMiddleware.isAdmin, imageStorage.upload.single('file'), studyMiddleware.verifyEditBody], async (req, res) => {
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
        if(req.body.domain){
            study.domain = req.body.domain;
        }
        if(req.body.description){
            study.description = req.body.description;
        }
        if(req.body.max_per_interval){
            study.max_per_interval = req.body.max_per_interval;
        }
        if(req.body.hours && req.body.minutes && req.body.seconds){
            study.cooldown = req.body.hours*3600 + req.body.minutes*60;
        }
        if(req.body.cooldown){
            study.cooldown = req.body.cooldown;
        }
        if(req.file){
            if(study.image_id){
                imageStorage.gfs.delete(study.image_id);
            }
            let image_url = process.env.ROOT+'/api/image/'+req.file.filename;
            study.image_url = image_url;
            study.image_id = req.file.id;
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
    });
});

router.get('/:study_id/stats', [verifyToken, authMiddleware.isAdmin], async (req, res) => {
    const study_id = req.params.study_id;
    //Search for every userStudy given te study_id
    await UserStudy.find({ study: study_id })
        .exec((err, userStudies) => {
            if(err){
                return res.status(404).json({
                    ok: false,
                    err
                });
            }
            //Response array defined
            let responseArray = [];
            userStudies.forEach(element => {
                //Get username
                let username;
                User.findOne({ _id: element.user })
                    .exec((err, user) => {
                        if(err){
                            res.status(500).json(err);
                        }
                        //If user exists
                        if(user){
                            username = user.names;
                            //Get last login date
                            let lastSession;
                            SessionLog.findOne({ userId: user._id, state: 'login' }, null, { sort: { 'createdAt': -1 }})
                                .exec((err, sessionLog) => {
                                    if(err){
                                        res.status(500).json(err);
                                    }
                                    //If sessionLog exists
                                    if(sessionLog){
                                        lastSession = sessionLog.createdAt;
                                        //Get total study challenges and answered challenges
                                        let challenges = element.challenges.length;
                                        let answers = element.challenges.filter((challenge) => challenge.finished === true).length;
                                        //Compose a response object 
                                        let responseObject = {
                                            username: username,
                                            challenges: challenges,
                                            answers: answers,
                                            lastSession: lastSession
                                        };
                                        //Add the response object to response array
                                        responseArray.push(responseObject);	 
                                        //Returns a JSON with the response array when its length matches the userStudies array length
                                        if(responseArray.length === userStudies.length){
                                            res.status(200).json({ 
                                                responseArray 
                                            });  
                                        }    
                                    }
                                    //If sessionLog doesn't exist                        
                                    else{
                                        //Get total study challenges and answered challenges
                                        let challenges = element.challenges.length;
                                        let answers = element.challenges.filter((challenge) => challenge.finished === true).length;                                        
                                        //Compose a response object with all null properties
                                        let responseObject = {
                                            username: username,
                                            challenges: challenges,
                                            answers: answers,
                                            lastSession: null
                                        };
                                        //Add the response object to response array
                                        responseArray.push(responseObject);	 
                                        //Returns a JSON with the response array when its length matches the userStudies array length
                                        if(responseArray.length === userStudies.length){
                                            res.status(200).json({ 
                                                responseArray 
                                            });  
                                        }                                         
                                    }
                                });
                        }
                        //If user doesn't exist                        
                        else{
                            //Compose a response object with all null properties
                            let responseObject = {
                                username: null,
                                challenges: null,
                                answers: null,
                                lastSession: null
                            };
                            //Add the response object to response array
                            responseArray.push(responseObject);	 
                            //Returns a JSON with the response array when its length matches the userStudies array length
                            if(responseArray.length === userStudies.length){
                                res.status(200).json({ 
                                    responseArray 
                                });  
                            }                            
                        }
                    });
            })
        });   
});

router.get('/:study_id/assistant', async (req, res) => {
    let study_id = req.params.study_id;
    const study = await Study.findOne({_id: study_id}, err => {
        if (err) {
            return res.status(404).json({
                ok: false,
                err: 'Study not found!'
            });
        }
    });
    if(!study){
        return res.status(404).json({
            ok: false,
            err: 'Study not found!'
        });
    }
    else{
        StudyAssistant.findOne({study: study._id}, (err, studyAssistant) => {
            if (err) {
                return res.status(404).json({
                    ok: false,
                    err: 'Study not found!'
                });
            }
            else{
                res.status(200).json({
                    ok: true,
                    studyAssistant
                });
            }
        });
    }
});

router.post('/:study_id/assistant', async (req, res) => {
    let study_id = req.params.study_id;
    const study = await Study.findOne({_id: study_id}, err => {
        if (err) {
            return res.status(404).json({
                ok: false,
                err: 'Study not found!'
            });
        }
    });
    if(!study){
        return res.status(404).json({
            ok: false,
            err: 'Study not found!'
        });
    }
    else{
        const studyAssistant = new StudyAssistant({
            study: study._id,
            assistant: req.body.assistant
        })
        studyAssistant.save((err, studyAssistant)=> {
            if(err){
                return res.status(404).json({
                    ok: false,
                    err,
                  });   
            }
            res.status(200).json({
                ok: true,
                studyAssistant
            });
        })
    }
});

router.put('/:study_id/assistant', async (req, res) => {
    let study_id = req.params.study_id;
    const study = await Study.findOne({_id: study_id}, err => {
        if (err) {
            return res.status(404).json({
                ok: false,
                err: 'Study not found!'
            });
        }
    });
    if(!study){
        return res.status(404).json({
            ok: false,
            err: 'Study not found!'
        });
    }
    else{
        const studyAssistant = await StudyAssistant.findOne({study: study._id}, err => {
            if (err) {
                return res.status(404).json({
                    err: 'Study not found!'
                });
            }
        });
        studyAssistant.assistant = req.body.assistant;
        studyAssistant.save((err, studyAssistant)=> {
            if(err){
                return res.status(404).json({
                    ok: false,
                    err,
                  });   
            }
            res.status(200).json({
                ok: true,
                studyAssistant
            });
          })
    }
});

module.exports = router;