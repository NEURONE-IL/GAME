const express = require('express');
const router = express.Router();

const User = require('../models/user');

const playerService = require('../services/neuronegm/player')


const verifyToken = require('../middlewares/verifyToken');

router.get('/userPoints/:user_id' , async (req, res) => {
    const _id = req.params.user_id;
    const user = await User.findOne({_id: _id}, err => {
        if (err) {
            return res.status(404).json({
                err
            });
        }
    });
    await playerService.getPlayersPoints(user.gm_code, (err, points) => {
        if(err){
            res.status(404).send(err);
        }
        res.status(200).send(points);
    })
});

router.get('/userLevels/:user_id' , async (req, res) => {
    const _id = req.params.user_id;
    const user = await User.findOne({_id: _id}, err => {
        if (err) {
            return res.status(404).json({
                err
            });
        }
    });
    await playerService.getPlayerLevels(user.gm_code, (err, levels) => {
        if(err){
            res.status(404).send(err);
        }
        res.status(200).send(levels);
    })
});

router.get('/userBadges/:user_id' , async (req, res) => {
    const _id = req.params.user_id;
    const user = await User.findOne({_id: _id}, err => {
        if (err) {
            return res.status(404).json({
                err
            });
        }
    });
    await playerService.getPlayersBadges(user.gm_code, (err, badges) => {
        if(err){
            res.status(404).send(err);
        }
        res.status(200).send(badges);
    })
});

router.get('/userChallenges/:user_id' , async (req, res) => {
    const _id = req.params.user_id;
    const user = await User.findOne({_id: _id}, err => {
        if (err) {
            return res.status(404).json({
                err
            });
        }
    });
    await playerService.getPlayerChallenges(user.gm_code, (err, challenges) => {
        if(err){
            res.status(404).send(err);
        }
        res.status(200).send(challenges);
    })
});

router.get('/userActions/:user_id' , async (req, res) => {
    const _id = req.params.user_id;
    const user = await User.findOne({_id: _id}, err => {
        if (err) {
            return res.status(404).json({
                err
            });
        }
    });
    await playerService.getPlayerActions(user.gm_code, (err, challenges) => {
        if(err){
            res.status(404).send(err);
        }
        res.status(200).send(challenges);
    })
});




module.exports = router;