const express = require('express');
const router = express.Router();
const Challenge = require('../models/challenge');
const User = require('../models/user');
const UserChallenge = require('../models/userChallenge');
const StudySearch = require('../models/studySearch');
const GameElement = require('../models/gameElement');
const levenshtein = require('../node_modules/js-levenshtein');
const normalize = require('../node_modules/normalize-diacritics');

const pointService = require('../services/neuronegm/point');
const actionService = require('../services/neuronegm/action');
const authMiddleware = require('../middlewares/authMiddleware');
const challengeMiddleware = require('../middlewares/challengeMiddleware');
const verifyToken = require('../middlewares/verifyToken');

const {EventEmitter} = require('events');
var AsyncLock = require('async-lock');
var lock = new AsyncLock();

updateChallengeStudySearch = async (study_id) => {
    try {
      //Encontrar el studySearch
      console.log(study_id)
      const studySearch = await StudySearch.findOne({study:study_id}, err =>{
        if(err){
            return res.status(404).json({
                ok: false,
                err
            });
        }
      });

      //Encontrar los challenges asociados
      const challenges = await Challenge.find({study: study_id}, err => {
        if(err){
          return res.status(404).json({
              ok: false,
              err
          });
        }
      })

      //Update
      let challengeArr = [];
      await challenges.forEach( challenge => {
        challengeArr.push(challenge.question)
      })
      studySearch.challenges = challengeArr;

      studySearch.save(err => {
        if(err){
            return res.status(404).json({
                err
            });
        }
      })
    }
    catch (err) {
        return res.status(400).json({
            ok: false,
            err
        });
    }
};

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
        updateChallengeStudySearch(challenge.study);
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
        studyId: req.body.studyId,
        date: req.body.date,
        answers: req.body.answers,
        hintUsed: req.body.hintUsed,
        comment: req.body.comment,
        timeLeft: req.body.timeLeft,
        distance: distance,
        pointsObtained: pointsObtained
    })
    user.interval_answers = user.interval_answers+1;
    await user.save();
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

router.get('/answers/last', verifyToken, async (req, res)=> {
    const user_id = req.user;
    console.log(user_id)
    UserChallenge.find({user: user_id}, (err, last_answer) => {
        if (err) {
            return res.status(404).json({
                err
            });
        }
        res.status(200).json({
            last_answer: last_answer[0]
        });
    }).sort({createdAt: -1});
})

router.get('/editStatus/:challenge_id/:user_id', async (req, res) => {
    console.log('Event Source for Study Edit Challenges');

    var Stream = new EventEmitter();    
    const _challenge_id_event = req.params.challenge_id;       
    const _user_challenge_id_event = req.params.user_id;

    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
    });

    Stream.on('push', function(event, data){
        res.write('event: '+ String(event)+'\n'+'data: ' + JSON.stringify(data)+"\n\n");
    })

    var id = setInterval(async function(){
        const challenge = await Challenge.findOne({_id:_challenge_id_event}, (err) => {
            if (err) {
                return res.status(404).json({
                    err
                });
            }
        });
        Stream.emit('push','message',{currentUsers: challenge.edit});

        if(challenge.edit[0] == _user_challenge_id_event){
            if(challenge.edit.length == 1)
                Stream.removeAllListeners();
            clearInterval(id);
        }
    }, 10000); 
});

router.put('/requestEdit/:challenge_id', [verifyToken, authMiddleware.isAdmin], async (req, res) => {
    
    const _challengeRequestEdit = req.params.challenge_id;
    const _userRequestEditChall = req.body.user;

    console.log(_userRequestEditChall + ' arrived');
    console.log(_challengeRequestEdit + ' challenge');

    lock.acquire(_challengeRequestEdit, async function(done) {
        console.log(_userRequestEditChall + ' acquire');
        
        const challenge = await Challenge.findOne({_id:_challengeRequestEdit}, err => {
            if (err) {
                return res.status(404).json({
                    err
                });
            }
        });
        challenge.edit.push(_userRequestEditChall)
        challenge.save(err => {
            if(err){
                return res.status(404).json({
                    ok: false,
                    err
                });
            }
            res.status(200).json({users: challenge.edit});
        })
        //await delay(5); //Para probar
        done(challenge.edit)
        
    }, async function(edit) {
        const index = edit.indexOf(_userRequestEditChall); 
        console.log('Position to edit: ', (index+1));
        console.log('Lock free...')
    })
})

router.put('/releaseChallenge/:challenge_id', [verifyToken, authMiddleware.isAdmin], async (req, res) => {
    console.log('releaseEntrando')
    const _challengeRelease = req.params.challenge_id;
    const _userChallengeRelease = req.body.user;
    
    console.log('challenge',_challengeRelease);
    console.log('user',_userChallengeRelease);

    const challenge = await Challenge.findOne({_id:_challengeRelease}, err => {
        if (err) {
            return res.status(404).json({
                err
            });
        }
    });

    const result = challenge.edit.filter(x => x !== _userChallengeRelease);
    challenge.edit = result;

    challenge.save(err => {
        if(err){
            return res.status(404).json({
                ok: false,
                err
            });
        }
        res.status(200).json({users: challenge.edit});
    })
    //await delay(5); Para probar
        
})

router.put('/:challenge_id', [verifyToken, authMiddleware.isAdmin, challengeMiddleware.verifyEditBody], async (req, res) => {
    const _id = req.params.challenge_id;
    const _user_edit = req.params.user_edit;
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
        if(req.body.question_code){
            challenge.question_code = req.body.question_code;
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
        if(req.body.messages){
            if(req.body.messages === '-')
                challenge.messages = '';
            else
                challenge.messages = req.body.messages;
        }
        
        challenge.updatedAt = Date.now();
        challenge.save((err, challenge) => {
            if (err) {
                return res.status(404).json({
                    err
                });
            }
            const result = challenge.edit.filter(x => x !== _user_edit);
            challenge.edit = result;
            
            updateChallengeStudySearch(challenge.study);
            res.status(200).json({
                challenge
            });
        })
    })
})

router.delete('/:challenge_id',  [verifyToken, authMiddleware.isAdmin] , async (req, res) => {
    const _id = req.params.challenge_id;
    Challenge.findOneAndDelete({_id: _id}, (err, challenge) => {
        if (err) {
            return res.status(404).json({
                err
            });
        }
        console.log(challenge)
        updateChallengeStudySearch(challenge.study)
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