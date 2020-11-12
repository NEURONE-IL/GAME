const express = require('express');
const router = express.Router();
const SessionLog = require('../models/sessionLog');

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
    sessionLog.save((err, sessionLog) => {
        if (err) {
            return res.status(404).json({
                err
            });
        }
        res.status(200).json({
            sessionLog
        });
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