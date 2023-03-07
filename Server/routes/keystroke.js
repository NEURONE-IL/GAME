const express = require('express');
const router = express.Router();
const Keystroke = require('../models/keystroke');

const authMiddleware = require('../middlewares/authMiddleware');
const verifyToken = require('../middlewares/verifyToken');

router.get('', [verifyToken] , async (req, res) => {
    Keystroke.find({}, (err, keystrokes) =>{
        if(err){
            return res.status(404).json({
                ok: false,
                err
            });
        }
        res.status(200).json({keystrokes});
    });
})

router.get('/:keystroke_id', [verifyToken] , async (req, res) => {
    const _id = req.params.keystroke_id;
    Keystroke.findOne({_id: _id}, (err, keystroke) =>{
        if(err){
            return res.status(404).json({
                ok: false,
                err
            });
        }
        res.status(200).json({keystroke});
    });
});

router.post('',  [verifyToken], async (req, res) => {
    const keystroke = new Keystroke(req.body);
    keystroke.save((err, keystroke) => {
        if (err) {
            return res.status(404).json({
                err
            });
        }
        res.status(200).json({
            keystroke
        });
    })
});


router.delete('/:keystroke_id',  [verifyToken, authMiddleware.isAdmin] , async (req, res) => {
    const _id = req.params.keystroke_id;
    Keystroke.deleteOne({_id: _id}, (err, keystroke) => {
        if (err) {
            return res.status(404).json({
                err
            });
        }
        res.status(200).json({
            keystroke
        });
    })
})


module.exports = router;