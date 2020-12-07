const express = require('express');
const credential = require('../models/credential');
const router = express.Router();
const Credential = require('../models/credential');

const connect = require('../services/neuronegm/connect');

router.get('/register' , async (req, res) => {
    await connect.registerGM(err => {
        if(err){
            console.log(err)
            return res.status(404).send(err);
        }
        let credential = new Credential({
            sec: 1,
            registered: true
        })
        credential.save(err => {
            if(err){
                return res.status(404).send(err);
            }
            connect.loginGM(credential, err => {
                if(err){
                    return res.status(404).send(err);
                }
                res.status(200).send("OK");
            })
        })
    })
})

router.get('/start' , async (req, res) => {
    await connect.connectGM((err, app) => {
        if(err){
            return res.status(404).send(err);
        }
        Credential.findOne({sec: 1}, (err, credential) => {
            if(err){
                return res.status(404).send(err);
            }
            credential.app_code = app.code;
            credential.save(err => {
                if(err){
                    return res.status(404).send(err);
                }
                res.status(200).send("OK");
            })
        })
    })
})



module.exports = router;