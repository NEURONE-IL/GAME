const express = require('express');
const router = express.Router();
const axios = require("axios");

const imageStorage = require('../middlewares/imageStorage');

const AdminNotification = require('../models/adminNotification');
const Study = require('../models/study');
const Challenge = require('../models/challenge');
const UserStudy = require('../models/userStudy');
const User = require('../models/user');
const Invitation = require('../models/invitation');
const History = require('../models/history');
const SessionLog = require('../models/sessionLog');
const StudyAssistant = require('../models/studyAssistant');
const StudySearch = require('../models/studySearch');
const Competence = require('../models/competence');
const Language = require('../models/language');


const authMiddleware = require('../middlewares/authMiddleware');
const studyMiddleware = require('../middlewares/studyMiddleware');
const verifyToken = require('../middlewares/verifyToken');
const groupService = require('../services/neuronegm/group');
const { forEach } = require('async');

/* Para Concurrencia*/
const {EventEmitter} = require('events');
var AsyncLock = require('async-lock');
var lock = new AsyncLock();

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
    }).populate({
        path: 'collaborators',
        populate: {
          path: 'user',
          model: User,
          select:'-password' 
        }
      }).populate({path: 'user', model: User, select:'-password'}).populate({path: 'competences', model: Competence});
});

/*
@Valentina Ligueño
TESTED: Método para obtener los estudios de un usuario en específico
*/
router.get('/byUser/:user_id', [verifyToken], async (req, res) => {
    const _id = req.params.user_id;
    Study.find({user: _id}, (err, studies) => {
        if(err){
            return res.status(404).json({
                ok: false,
                err
            });
        }
        res.status(200).json({studies});
    })
});

/*
@Valentina Ligueño
TESTED: Método para obtener solo estudios privados o públicos de un usuario
*/
router.get('/byUserbyPrivacy/:user_id/:privacy', [verifyToken], async (req, res) => {
    const _privacy = JSON.parse(req.params.privacy);
    const _id = req.params.user_id; 
    
    Study.find({user: _id, privacy: _privacy}, (err, studies) => {
        if(err){
            return res.status(404).json({
                ok: false,
                err
            });
        }

        res.status(200).json({studies});
    })
});

/*
@Valentina Ligueño
TESTED: Método para obtener los estudios por tipo de un usuario
*/
router.get('/byUserbyType/:user_id/:type', [verifyToken] ,async (req, res) => {
    const type = req.params.type;
    const _id = req.params.user_id; 
    
    Study.find({user: _id, type: type}, (err, studies) => {
        if(err){
            return res.status(404).json({
                ok: false,
                err
            });
        }

        res.status(200).json({studies});
    })
});

/*
@Valentina Ligueño
TESTED: Método para obtener los estudios de colaboración de un usuario en específico
*/
router.get('/byUserCollaboration/:user_id', [verifyToken], async (req, res) => {
    const _id = req.params.user_id;
    
    Study.find({"collaborators": { 
                  $elemMatch: {
                    user:_id,
                    invitation:'Aceptada'
                  }
                }}, (err, studies) => {
        if(err){
            return res.status(404).json({
                ok: false,
                err
            })
        }
        res.status(200).json({studies});
    }).populate({ path: 'user', model: User, select:'-password'});
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

/*
@Valentina Ligueño
TESTED: Método para clonar un estudio
*/
router.get('/copy/:study_id/user/:user_id/', [verifyToken], async (req, res) => {
    const _id = req.params.study_id;
    const _user_id = req.params.user_id;
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
        name: study.name+' (clonado)',
        description: study.description,
        domain: study.domain,
        max_per_interval: study.max_per_interval,
        cooldown: study.cooldown,
        privacy: true,
        tags: study.tags,
        user: _user_id,
        collaborators: [],
        type: 'clone',

        levels: study.levels,
        language: study.language,
        competences: study.competences,
        image_id: study.image_id,
        image_url: study.image_url
    });

    const post = JSON.stringify({query: '*', domain: _id});

    let filteredResources = [];

    await axios.post(process.env.NEURONE_URL+'v1/document/search', post,
    {
        headers: { 'Content-Type': 'text/plain'}
    }).then((response)=> {
        let resources = response.data;
        filteredResources = resources.filter(resource => resource.type != 'image');
    }).catch((err) => {
        console.log(err);
    })

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
        
        var _challenge_id = JSON.stringify(challenges[i]._id);
        let challengeResources = filteredResources.filter(resource => JSON.stringify(resource.task[0]) === _challenge_id);
        
        challengeResources.forEach( async resource => { 
            resourceCopy = {
                docName: resource.docName+'clone '+copy._id,
                domain: [copy._id],
                keywords: resource.keywords, 
                locale: resource.locale,
                relevant: resource.relevant,
                searchSnippet: resource.searchSnippet,
                task: [newChallenge._id],
                title: resource.title,
                url: resource.url
            }
            if(resource.maskedUrl != null && resource.maskedUrl != 'undefined')
               Object.assign(resourceCopy, {maskedUrl: resource.maskedUrl})

            if(resource.type != null && resource.type != 'undefined')
               Object.assign(resourceCopy, {type: resource.type})
            else
               Object.assign(resourceCopy, {type: 'document'})
            
            await axios.post(process.env.NEURONE_URL+'v1/document/load', resourceCopy,
            {
                headers: { 'Content-Type': 'text/plain'}
                }).then((response)=> {
                    console.log(response.data.title); 
                }).catch((err) => {
                    console.log(err);
                })
        })
    }

    let copyHistory = new History({
        user: _user_id,
        study: _id,
        type: 'clone',
        description: 'The study was cloned'
    })
    copyHistory.save(err => {
        if(err){
            return res.status(404).json({
                err
            });
        }
    })
    const userClone = await User.findOne({_id: _user_id},{password:0}, err => {
        if (err) {
            return res.status(404).json({
                err
            });
        }
    });
    const notification = new AdminNotification ({
        userFrom:userClone,
        userTo: study.user,
        type: 'clone',
        history: copyHistory._id,
        description:userClone.names + ' ' +userClone.last_names + ' ha clonado su estudio: ' + study.name,
        seen: false,
    });
    notification.save(err => {
        if(err){
            return res.status(404).json({
                err
            });
        }
    })

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
                        message:'Study successfully cloned',
                        copy
                    });
                })
            }
        });
    })
})

/*
@Valentina Ligueño
TESTED: Método para crear un estudio con las nuevas implementaciones
*/
router.post('',  [verifyToken, authMiddleware.isAdmin,  imageStorage.upload.single('file'), studyMiddleware.verifyBody], async (req, res) => {
    let cooldown = req.body.hours*3600 + req.body.minutes*60;
    let collaborators = JSON.parse(req.body.collaborators);
    let tags = JSON.parse(req.body.tags);
    let levels = JSON.parse(req.body.levels);
    let competences = JSON.parse(req.body.competences);
    const study = new Study({
        name: req.body.name,
        domain: req.body.domain,
        max_per_interval: 1,
        cooldown: cooldown,

        user: req.body.user,
        privacy: req.body.privacy,
        type: 'own',
        collaborators: collaborators,
        tags: tags,
        levels: [],
        language: "62b4c40b75c8e419c58e884e",
        competences: [],
        //levels: levels,
        //language: req.body.language,
        //competences: competences,

    });
    if(collaborators.length > 0){
        collaborators.forEach( async coll => {
            const invitation = new Invitation ({
                user: coll.user,
                study: study._id,
                status: 'Pendiente',
            });
            invitation.save(err => {
                if(err){
                    return res.status(404).json({
                        err
                    });
                }
            })
            const notification = new AdminNotification ({
                userFrom:req.body.user,
                userTo: coll.user,
                type: 'invitation',
                invitation: invitation._id,
                description:'Invitación para colaborar en el estudio: ' + study.name,
                seen: false,
            });
            notification.save(err => {
                if(err){
                    return res.status(404).json({
                        err
                    });
                }
            })
        });
    }

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
    study.save(async (err, study) => {
      if (err) {
        console.log(err)
        return res.status(404).json({
            err
        });

      } 
      if(study.privacy == false){
        await study.populate({path:'user', model:User}).populate({path:'language', model:Language}).execPopulate();
        createStudySearch(study, [],'createStudy');

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
                    message: 'Study successfully created',
                    study
                  });
              })
          }
      });
    })
});

/*
@Valentina Ligueño
NOT_FOR_TEST: Método para suscribirse a la edición de un estudio
*/
router.get('/editStatus/:study_id/:user_id' ,async (req, res) => {
    console.log('Event Source for Study Edit Status');
    
    var Stream = new EventEmitter(); 
    const _study_id_event = req.params.study_id;       
    const _user_id_event = req.params.user_id;

    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
    });

    Stream.on(_user_id_event+'/'+_study_id_event, function(event, data){
        res.write('event: '+ String(event)+'\n'+'data: ' + JSON.stringify(data)+"\n\n");
    })

    var id = setInterval(async function(){
        console.log(id);
        const study = await Study.findOne({_id:_study_id_event}, (err) => {
            if (err) {
                return res.status(404).json({
                    err
                });
            }
        });
        Stream.emit(_user_id_event+'/'+_study_id_event,'message',{currentUsers: study.edit});

        if(study.edit[0] == _user_id_event){
            if(study.edit.length == 1)
                Stream.removeAllListeners();
            clearInterval(id);
        }
    }, 10000); 
});

/*
@Valentina Ligueño
TESTED: Método para solicitar la edición de un estudio
*/
router.put('/requestEdit/:study_id'/*, [verifyToken, authMiddleware.isAdmin]*/, async (req, res) => {
    //console.log('requestEdit');
    const _studyRequestEdit = req.params.study_id;
    const _userRequestEdit = req.body.user;

    //console.log(_userRequestEdit + ' arrived');
    //console.log('Entering to Function: ', new Date())

    lock.acquire(_studyRequestEdit, async function(done) {
        //console.log('Entering to Lock: ', new Date())
        //console.log(_userRequestEdit + ' acquire');
        
        const study = await Study.findOne({_id:_studyRequestEdit}, err => {
            if (err) {
                return res.status(404).json({
                    err
                });
            }
        });
        study.edit.push(_userRequestEdit)
        study.save(err => {
            if(err){
                return res.status(404).json({
                    ok: false,
                    err
                });
            }
            done(study.edit);
            res.status(200).json({users: study.edit, message:'Edit list successfully updated'});
        })
        //await delay(5); //Para probar
        
    }, async function(edit) {
        //console.log(edit)
        const index = edit.indexOf(_userRequestEdit); 
        //console.log('Position to edit: ', (index+1));
        //console.log('Lock free');
    })
})

/*
@Valentina Ligueño
TESTED: Método para liberar la edición de un estudio
*/
router.put('/releaseStudy/:study_id', [verifyToken, authMiddleware.isAdmin], async (req, res) => {
    //console.log('releaseEntrando')
    const _studyRelease = req.params.study_id;
    const _userRelease = req.body.user;

    const study = await Study.findOne({_id:_studyRelease}, err => {
        if (err) {
            return res.status(404).json({
                err
            });
        }
    });

    const result = study.edit.filter(x => x !== _userRelease);
    study.edit = result;
    //console.log('Edit List: ',study.edit)
    study.save(err => {
        if(err){
            return res.status(404).json({
                ok: false,
                err
            });
        }
        res.status(200).json({message:'Edit list successfully updated', study});
    })
    //await delay(5); Para probar
        
})

/*
@Valentina Ligueño
TESTED: Método para editar un estudio con las nuevas implementaciones
*/

router.put('/:study_id', [verifyToken, authMiddleware.isAdmin, imageStorage.upload.single('file'), studyMiddleware.verifyEditBody], async (req, res) => {
    const _id = req.params.study_id;
    const _userEdit = req.body.user_edit;

    const study = await Study.findOne({_id: _id}, (err, study) => {
        if (err) {
            return res.status(404).json({
                err
            });
        }
        var privacyChange = false;
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

        let privacy = JSON.parse(req.body.privacy);

        if(study.privacy == privacy)
            privacyChange = false;
        
        else {
            study.privacy = privacy
            privacyChange = true;
        }
            
        if(req.body.collaborators){
            let collaborators = JSON.parse(req.body.collaborators);
            study.collaborators = collaborators;
        }
        if(req.body.tags){
            let tags = JSON.parse(req.body.tags);
            study.tags = tags;
        }

        if(req.body.levels){
            let levels = JSON.parse(req.body.levels);
            study.levels = levels;
        } 
        if(req.body.competences){
            let competences = JSON.parse(req.body.competences);
            study.competences = competences;
        } 
        if(req.body.language){
            study.language = req.body.language;
        } 

        if(req.file){
            if(study.image_id){
                imageStorage.gfs.delete(study.image_id);
            }
            let image_url = process.env.ROOT+'/api/image/'+req.file.filename;
            study.image_url = image_url;
            study.image_id = req.file.id;
        }
        
        const result = study.edit.filter(x => x !== _userEdit);
        study.edit = result;
        study.updatedAt = Date.now();

        study.save(async (err, study) => {
            if (err) {
                return res.status(404).json({
                    err
                });
            }
            await study.populate({path:'user', model:User}).populate({path:'language', model:Language}).execPopulate();
            
            if(study.privacy == true && privacyChange)
              deleteStudySeach(study._id);
            else if(study.privacy == false && privacyChange)
              createStudySearch(study, [], 'privacyUpdate');
            else if(study.privacy == false && !privacyChange)
              updateStudySearch(study);
            
            res.status(200).json({
                message:'Study successfully updated',
                study
            });
        })
    }).populate({path:'user', model:User})
})

/*
@Valentina Ligueño
TESTED: Método para gestionar los colaboradores de un estudio
*/
router.put('/editCollaborator/:study_id', [verifyToken, authMiddleware.isAdmin], async (req, res) => {
    
    const _id = req.params.study_id;

    const study = await Study.findOne({_id: _id}, (err, study) => {
        if (err) {
            return res.status(404).json({
                err
            });
        }
    })
    let collaborators = req.body.collaborators;
    if(collaborators){
        study.collaborators.forEach(async coll => {
            //Si el colaborador actual del loop no se encuentra en la lista de colaboradores
            let collDelete = collaborators.some(item => JSON.stringify(item.user._id) === JSON.stringify(coll.user));

            if(!collDelete && coll.invitation === 'Pendiente'){

                console.log('borra')
                await Invitation.findOneAndDelete({user: coll.user, status: 'Pendiente', study: study._id}, async (err, inv) =>{
                    if(err){
                        return res.status(404).json({
                            ok: false,
                            err
                        });
                    }
                    await AdminNotification.deleteOne({invitation: inv._id}, err =>{
                        if(err){
                            return res.status(404).json({
                                ok: false,
                                err
                            });
                        }
                    })
                })
                
                
            }
        });
        collaborators.forEach((coll, i) => {
            let index = study.collaborators.findIndex(item => item.user == coll.user._id);

            if(!(index >= 0)){
                const invitation = new Invitation ({
                    user: coll.user,
                    study: study,
                    status: 'Pendiente',
                });
                invitation.save(err => {
                    if(err){
                        return res.status(404).json({
                            err
                        });
                    }
                })
                const notification = new AdminNotification ({
                    userFrom:study.user,
                    userTo: coll.user,
                    type: 'invitation',
                    invitation: invitation,
                    description:'Invitación para colaborar en el estudio: ' + study.name,
                    seen: false,
                });
                notification.save(err => {
                    if(err){
                        return res.status(404).json({
                            err
                        });
                    }
                })
            }
            if(i === (collaborators.length-1))
              study.collaborators = req.body.collaborators
        })
        study.collaborators = req.body.collaborators
    }
    study.updatedAt = Date.now();

    await study.save(async (err, study) => {
        if (err) {
            return res.status(404).json({
                err
            });
        }
        await study.populate({
            path: 'collaborators',
            populate: {
              path: 'user',
              model: User,
              select:'-password' 
            }
          }).populate({path: 'user', model: User, select:'-password'}).execPopulate()
        res.status(200).json({
            message:'Collaborators list successfully updated',
            study
        });
    })
})

/*
@Valentina Ligueño
TESTED: Método para eliminar un estudio con las nuevas implementaciones
*/
router.delete('/:study_id',  [verifyToken, authMiddleware.isAdmin] , async (req, res) => {
    const _id = req.params.study_id;
    Study.findOneAndDelete({_id: _id}, (err, study) => {
        if (err) {
            return res.status(404).json({
                err
            });
        }
        if(study.privacy === false)
          deleteStudySeach(_id);
        
        deleteInvitations(study,res)
        res.status(200).json({
            message: 'Study successfully deleted',
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

async function deleteStudySeach(study_id){
    //console.log('deleteStudySeach');
    try {
      const _study_id = study_id;
      //Encontrar el studySearch
      await StudySearch.deleteOne({study:_study_id}, err =>{
          if(err){
          console.log(err);
        }
      });
    }
    catch (err) {
          console.log(err);
     }
  };
  
async function updateStudySearch(study){
      //console.log('updateStudySearch');
      try {
        const _study_id = study._id;
        //Encontrar el studySearch
        const studySearch = await StudySearch.findOne({study:_study_id}, err =>{
          if(err){
              console.log(err);
          }
        });
        let competences = [];
        await study.competences.forEach( comp => {
            competences.push(comp.name)
        })
  
        studySearch.name = study.name;
        studySearch.description= study.description;
        studySearch.tags= study.tags;
        studySearch.levels= study.levels;
        studySearch.lang= study.language.name;
        studySearch.competences= competences;
  
        studySearch.save(err => {
          if(err){
              console.log(err)
          }
        })
      }catch (err) {
        console.log(err)
      }
  };
  
async function createStudySearch(study, challenges, type){
    //console.log('createStudySearch');
  
    try {
      const _study_id = study._id;
      let challengeArr = [];
      let competences = [];
        await study.competences.forEach( comp => {
            competences.push(comp.name)
        })
  
      if(type === 'privacyUpdate'){
        challenges = await Challenge.find({study: _study_id}, err => {
          if(err){
            console.log(err);
          }
        })
      }
  
      if(challenges.length > 0){
        await challenges.forEach( challenge => {
          challengeArr.push(challenge.question)
        })
      }
      const studySearch = new StudySearch({
        name: study.name,
        author: study.user.names + ' ' + study.user.last_names,
        description: study.description,
        userID: study.user._id,
        tags: study.tags,
        challenges: challengeArr,
        study: study,
        levels: study.levels,
        lang: study.language.name,
        competences: competences,
      })
      studySearch.save(err => {
        if(err){
          console.log(err);
        }
      })
    }
    catch (err) {
      console.log(err);
    }
};

async function deleteInvitations(study, res){
    const invitations = await Invitation.find({study:study, status: 'Pendiente'}, err =>{
      if(err){
          return res.status(404).json({
              ok: false,
              err
          });
      }
    });
  
    if(invitations.length > 0){
      invitations.forEach(async invitation => {
        await AdminNotification.deleteOne({invitation: invitation._id}, err => {
          if (err) {
            return res.status(404).json({
                err
            });
          }
        })
        await Invitation.deleteOne({_id:invitation._id}, err => {
          if (err) {
            return res.status(404).json({
                err
            });
          }
        })
    
      })
    }
}

module.exports = router;