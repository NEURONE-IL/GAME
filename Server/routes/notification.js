const express = require('express');
const router = express.Router();
const Notification = require('../models/notification');
const User = require('../models/user');

router.get('/getNotifications/:user_id', async(req, res) => {
    const _id = req.params.user_id;
    let notifications = await Notification.find({seen: false, user: _id}, err => {
        if(err){
            return res.status(400).json({
            ok: false,
            err
            });
        }
    }).sort({createdAt: -1})
    return res.status(200).json({
        notifications
    });  
})

router.put('/updateNotifications', async(req, res) => {
    const notifications = req.body.notifications;
    for(let i = 0; i<notifications.length; i++){
        await Notification.updateOne({_id: notifications[i]._id }, { $set: {seen: true } }, err=> {
            if(err){
                return res.status(400).json({
                ok: false,
                err
                });
            }
        })
    }
    return res.status(200).json({
        ok: true
    }); 
})


router.post('/getPoints', async (req, res) => {
    let player = req.body.player;
    console.log("Notification")
    if(!player || !player.code){
        return res.status(400).json({
            ok: false,
            err: 'Player not found!'
        });
    }
    let player_code = player.code;
    let user = await User.findOne({gm_code: player_code}, err => {
        if(err){
            return res.status(400).json({
            ok: false,
            err: 'Player not found!'
            });
        }
    })
    if(!user){
        return res.status(400).json({
            ok: false,
            err: 'Player not found!'
        });
    }
    let notification = new Notification({
        user: user._id,
        name: req.body.name,
        type: 'point',
        seen: false,
        element_code: req.body.point.code,
        messageEN: req.body.messageEN,
        messageES: req.body.messageES,
        acquisitionDate: req.body.acquisitionDate,
        notificationDate: req.body.notificationDate
    })

    notification.save( err => {
        if(err){
            return res.status(404).json({
                ok: false,
                err
            });
        }
        console.log("Notification received!")
        return res.status(200).send("Notification received!");
    })
});

router.post('/challengeCompleted', async (req, res) => {
    let player = req.body.player;
    if(!player || !player.code){
        return res.status(400).json({
            ok: false,
            err: 'Player not found!'
        });
    }
    let player_code = player.code;
    let user = await User.findOne({gm_code: player_code}, err => {
        if(err){
            return res.status(400).json({
            ok: false,
            err: 'Player not found!'
            });
        }
    })
    if(!user){
        return res.status(400).json({
            ok: false,
            err: 'Player not found!'
        });
    }
    let notification = new Notification({
        user: user._id,
        name: req.body.name,
        type: 'challenge',
        seen: false,
        element_code: req.body.challenge.code,
        messageEN: req.body.messageEN,
        messageES: req.body.messageES,
        acquisitionDate: req.body.acquisitionDate,
        notificationDate: req.body.notificationDate
    });
    notification.save( err => {
        if(err){
            return res.status(404).json({
                ok: false,
                err
            });
        }
        return res.status(200).send("Notification received!");
    })
});

router.post('/badgeAcquired', async (req, res) => {
    let player = req.body.player;
    console.log("Notification")
    if(!player || !player.code){
        return res.status(400).json({
            ok: false,
            err: 'Player not found!'
        });
    }
    let player_code = player.code;
    let user = await User.findOne({gm_code: player_code}, err => {
        if(err){
            return res.status(400).json({
            ok: false,
            err: 'Player not found!'
            });
        }
    })
    if(!user){
        return res.status(400).json({
            ok: false,
            err: 'Player not found!'
        });
    }
    let notification = new Notification({
        user: user._id,
        name: req.body.name,
        type: 'badge',
        seen: false,
        element_code: req.body.badge.code,
        messageEN: req.body.messageEN,
        messageES: req.body.messageES,
        acquisitionDate: req.body.acquisitionDate,
        notificationDate: req.body.notificationDate
    });
    notification.save( err => {
        if(err){
            return res.status(404).json({
                ok: false,
                err
            });
        }
        return res.status(200).send("Notification received!");
    })
});

router.post('/levelUp', async (req, res) => {
    let player = req.body.player;
    console.log("Notification")
    if(!player || !player.code){
        return res.status(400).json({
            ok: false,
            err: 'Player not found!'
        });
    }
    let player_code = player.code;
    let user = await User.findOne({gm_code: player_code}, err => {
        if(err){
            return res.status(400).json({
            ok: false,
            err: 'Player not found!'
            });
        }
    })
    if(!user){
        return res.status(400).json({
            ok: false,
            err: 'Player not found!'
        });
    }
    let notification = new Notification({
        user: user._id,
        name: req.body.name,
        type: 'level',
        element_code: req.body.level.code,
        messageEN: req.body.messageEN,
        messageES: req.body.messageES,
        acquisitionDate: req.body.acquisitionDate,
        notificationDate: req.body.notificationDate
    });
    notification.save( err => {
        if(err){
            return res.status(404).json({
                ok: false,
                err
            });
        }
        return res.status(200).send("Notification received!");
    })
});



module.exports = router;