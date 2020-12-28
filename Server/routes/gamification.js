const express = require('express');
const router = express.Router();

const User = require('../models/user');
const Credential = require('../models/credential');

const connectService = require('../services/neuronegm/connect');
const playerService = require('../services/neuronegm/player');
const actionService = require('../services/neuronegm/action');
const pointService = require('../services/neuronegm/point');
const badgeService = require('../services/neuronegm/badge');
const levelService = require('../services/neuronegm/level');
const challengeService = require('../services/neuronegm/challenge');
const leaderboardService = require('../services/neuronegm/leaderboard');


const verifyToken = require('../middlewares/verifyToken');

router.get('/isGamified', verifyToken, async (req, res) => {
    let credential = await Credential.findOne({code: "superadmin"}, err => {
        if(err){
            return res.status(404).json({
                ok: false,
                err
            });
        }
    });
    if(!credential){
        res.status(200).send({gamified: false, connected: false, message: "NEURONE-GM isn't connected!"});
    }
    if(credential.gamified){
        res.status(200).send({gamified: true, connected: true, message: "The app is gamified!"});
    }
    else{
        res.status(200).send({gamified: false, connected: true, message: "The app isn't gamified!"});
    }
});

router.get('/gamify', verifyToken, async (req, res) => {
    let credential = await Credential.findOne({code: "superadmin"}, err => {
        if(err){
            return res.status(404).json({
                ok: false,
                err
            });
        }
    });
    if(credential && !credential.gamified){
        await pointService.postAllPoints(err => {
            if(err){
                return res.status(404).json({
                    ok: false,
                    err
                });
            }
        });
        await actionService.postAllActions(err => {
            if(err){
                return res.status(404).json({
                    ok: false,
                    err
                });
            }
        });
        await badgeService.postAllBadges(err => {
            if(err){
                return res.status(404).json({
                    ok: false,
                    err
                });
            }
        });
        await connectService.postWebhooks(err => {
            if(err){
                return res.status(404).json({
                    ok: false,
                    err
                });
            }
        });
        res.status(200).send({ok: true, message: "Gamification part 1 completed!"});
    }
    else{
        res.status(400).send("Can't gamify!");
    }
})

router.get('/gamifyDependent', verifyToken, async (req, res) => {
    let credential = await Credential.findOne({code: "superadmin"}, err => {
        if(err){
            return res.status(404).json({
                ok: false,
                err
            });
        }
    })
    if(credential && !credential.gamified){
        await levelService.postAllLevels(err => {
            if(err){
                return res.status(404).json({
                    ok: false,
                    err
                });
            }
        });
        await challengeService.postAllChallenges(err => {
            if(err){
                return res.status(404).json({
                    ok: false,
                    err
                });
            }
        });
        await leaderboardService.postAllLeaderboards(err => {
            if(err){
                return res.status(404).json({
                    ok: false,
                    err
                });
            }
        })
        credential.gamified = true;
        await credential.save(err=> {
            if(err){
                return res.status(404).json({
                    ok: false,
                    err
                });
            }
        })
        res.status(200).send({ok: true, message: "Gamification completed!"});
    }
    else{
        res.status(400).send("Can't gamify!");
    }
})


router.get('/userPoints/:user_id' , verifyToken, async (req, res) => {
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

router.get('/userLevels/:user_id' , verifyToken, async (req, res) => {
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

router.get('/userLevelProgress/:user_id' , verifyToken, async (req, res) => {
    const _id = req.params.user_id;
    const user = await User.findOne({_id: _id}, err => {
        if (err) {
            return res.status(404).json({
                err
            });
        }
    });
    await playerService.getPlayerLevelProgress(user.gm_code, (err, levels) => {
        if(err){
            res.status(404).send(err);
        }
        res.status(200).send(levels);
    })
});

router.get('/userBadges/:user_id' , verifyToken, async (req, res) => {
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

router.get('/userChallenges/:user_id' , verifyToken, async (req, res) => {
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

router.get('/userActions/:user_id' , verifyToken, async (req, res) => {
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