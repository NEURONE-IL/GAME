const express = require('express');
const router = express.Router();
const SessionLog = require('../models/sessionLog');
const User = require('../models/user');
const GameElement = require('../models/gameElement');

const actionService = require('../services/neuronegm/action');
const authMiddleware = require('../middlewares/authMiddleware');
const verifyToken = require('../middlewares/verifyToken');

router.get('', [verifyToken] , async (req, res) => {
    SessionLog.find({}, (err, sessionLogs) =>{
        if(err){
            return res.status(404).json({
                ok: false,
                err
            });
        }
        res.status(200).json({sessionLogs});
    });
})

router.get('/:sessionLog_id', [verifyToken] , async (req, res) => {
    const _id = req.params.sessionLog_id;
    SessionLog.findOne({_id: _id}, (err, sessionLog) =>{
        if(err){
            return res.status(404).json({
                ok: false,
                err
            });
        }
        res.status(200).json({sessionLog});
    });
});

router.post('',  [verifyToken], async (req, res) => {
    const sessionLog = new SessionLog(req.body);
    let lastLogin;
    let user;
    let loginAction;
    if(sessionLog.state === "login"){
        lastLogin = await SessionLog.find({state: "login", userId: req.body.userId}).sort({"createdAt": -1}).limit(1);
        user = await User.findById(req.body.userId);
        loginAction = await GameElement.findOne({key: 'inicio_sesion_1'});
    }
    await sessionLog.save((err, sessionLog) => {
        if (err) {
            return res.status(404).json({
                err
            });
        }
        if(loginAction && user && user.gm_code && lastLogin && lastLogin.createdAt.getUTCDate() < sessionLog.createdAt.getUTCDate()){
            let post =  {action_code: loginAction.gm_code, date: sessionLog.createdAt};
            actionService.postPlayerAction(post, user.gm_code, (err, data) => {
                if(err){
                    console.log(err);
                }
                res.status(200).json({
                    user
                });
            });
        }
        else{
            res.status(200).json({
                sessionLog
            });
        }
    })
});


router.delete('/:sessionLog_id',  [verifyToken, authMiddleware.isAdmin] , async (req, res) => {
    const _id = req.params.sessionLog_id;
    SessionLog.deleteOne({_id: _id}, (err, sessionLog) => {
        if (err) {
            return res.status(404).json({
                err
            });
        }
        res.status(200).json({
            sessionLog
        });
    })
})


module.exports = router;