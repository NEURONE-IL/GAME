const express = require('express');
const router = express.Router();
const MouseClick = require('../models/mouseClick');

const authMiddleware = require('../middlewares/authMiddleware');
const verifyToken = require('../middlewares/verifyToken');

router.get('', [verifyToken] , async (req, res) => {
    MouseClick.find({}, (err, mouseClicks) =>{
        if(err){
            return res.status(404).json({
                ok: false,
                err
            });
        }
        res.status(200).json({mouseClicks});
    });
})

router.get('/:mouseClick_id', [verifyToken] , async (req, res) => {
    const _id = req.params.mouseClick_id;
    MouseClick.findOne({_id: _id}, (err, mouseClick) =>{
        if(err){
            return res.status(404).json({
                ok: false,
                err
            });
        }
        res.status(200).json({mouseClick});
    });
});

router.post('',  [verifyToken], async (req, res) => {
    const mouseClick = new MouseClick(req.body);
    mouseClick.save((err, mouseClick) => {
        if (err) {
            return res.status(404).json({
                err
            });
        }
        res.status(200).json({
            mouseClick
        });
    })
});


router.delete('/:mouseClick_id',  [verifyToken, authMiddleware.isAdmin] , async (req, res) => {
    const _id = req.params.mouseClick_id;
    MouseClick.deleteOne({_id: _id}, (err, mouseClick) => {
        if (err) {
            return res.status(404).json({
                err
            });
        }
        res.status(200).json({
            mouseClick
        });
    })
})


module.exports = router;