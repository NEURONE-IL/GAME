const express = require('express');
const router = express.Router();
const VisitedLink = require('../models/visitedLink');

const authMiddleware = require('../middlewares/authMiddleware');
const verifyToken = require('../middlewares/verifyToken');

router.get('', [verifyToken] , async (req, res) => {
    VisitedLink.find({}, (err, visitedLinks) =>{
        if(err){
            return res.status(404).json({
                ok: false,
                err
            });
        }
        res.status(200).json({visitedLinks});
    });
})

router.get('/:visitedLink_id', [verifyToken] , async (req, res) => {
    const _id = req.params.visitedLink_id;
    VisitedLink.findOne({_id: _id}, (err, visitedLink) =>{
        if(err){
            return res.status(404).json({
                ok: false,
                err
            });
        }
        res.status(200).json({visitedLink});
    });
});

router.post('',  [verifyToken], async (req, res) => {
    const visitedLink = new VisitedLink(req.body);
    visitedLink.save((err, visitedLink) => {
        if (err) {
            return res.status(404).json({
                err
            });
        }
        res.status(200).json({
            visitedLink
        });
    })
});


router.delete('/:visitedLink_id',  [verifyToken, authMiddleware.isAdmin] , async (req, res) => {
    const _id = req.params.visitedLink_id;
    VisitedLink.deleteOne({_id: _id}, (err, visitedLink) => {
        if (err) {
            return res.status(404).json({
                err
            });
        }
        res.status(200).json({
            visitedLink
        });
    })
})


module.exports = router;