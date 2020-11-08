const express = require('express');
const router = express.Router();
const MouseCoordinate = require('../models/mouseCoordinate');

const authMiddleware = require('../middlewares/authMiddleware');
const verifyToken = require('../middlewares/verifyToken');

router.get('', [verifyToken] , async (req, res) => {
    MouseCoordinate.find({}, (err, mouseCoordinates) =>{
        if(err){
            return res.status(404).json({
                ok: false,
                err
            });
        }
        res.status(200).json({mouseCoordinates});
    });
})

router.get('/:mouseCoordinate_id', [verifyToken] , async (req, res) => {
    const _id = req.params.mouseCoordinate_id;
    MouseCoordinate.findOne({_id: _id}, (err, mouseCoordinate) =>{
        if(err){
            return res.status(404).json({
                ok: false,
                err
            });
        }
        res.status(200).json({mouseCoordinate});
    });
});

router.post('',  [verifyToken], async (req, res) => {
    const mouseCoordinate = new MouseCoordinate(req.body);
    mouseCoordinate.save((err, mouseCoordinate) => {
        if (err) {
            return res.status(404).json({
                err
            });
        }
        res.status(200).json({
            mouseCoordinate
        });
    })
});


router.delete('/:mouseCoordinate_id',  [verifyToken, authMiddleware.isAdmin] , async (req, res) => {
    const _id = req.params.mouseCoordinate_id;
    MouseCoordinate.deleteOne({_id: _id}, (err, mouseCoordinate) => {
        if (err) {
            return res.status(404).json({
                err
            });
        }
        res.status(200).json({
            mouseCoordinate
        });
    })
})


module.exports = router;