const express = require('express');
const router = express.Router();
const Event = require('../models/event');

const authMiddleware = require('../middlewares/authMiddleware');
const verifyToken = require('../middlewares/verifyToken');

router.get('', [verifyToken] , async (req, res) => {
    Event.find({}, (err, events) =>{
        if(err){
            return res.status(404).json({
                ok: false,
                err
            });
        }
        res.status(200).json({events});
    });
})

router.get('/:event_id', [verifyToken] , async (req, res) => {
    const _id = req.params.event_id;
    Event.findOne({_id: _id}, (err, event) =>{
        if(err){
            return res.status(404).json({
                ok: false,
                err
            });
        }
        res.status(200).json({event});
    });
});

router.post('',  [verifyToken], async (req, res) => {
    const event = new Event(req.body);
    event.save((err, event) => {
        if (err) {
            return res.status(404).json({
                err
            });
        }
        res.status(200).json({
            event
        });
    })
});


router.delete('/:event_id',  [verifyToken, authMiddleware.isAdmin] , async (req, res) => {
    const _id = req.params.event_id;
    Event.deleteOne({_id: _id}, (err, event) => {
        if (err) {
            return res.status(404).json({
                err
            });
        }
        res.status(200).json({
            event
        });
    })
})


module.exports = router;