const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.post('/register', async (req, res)=>{
    //hash password
    const salt = await bcrypt.genSalt(10);
    const hashpassword = await bcrypt.hash(req.body.password, salt);
    //create user
    const user = new User({
        username: req.body.username,
        names: req.body.names,
        last_names: req.body.last_names,
        email: req.body.email,
        password: hashpassword
    })
    //save user in db
    user.save((err, user) => {
        if(err){
            return res.status(404).json({
                ok: false,
                err
            });
        }
        res.status(200).json({
            user
        });
    })
    
});

router.post('/login', async (req, res) => {
    //checking if email exists
    const user = await User.findOne({ email: req.body.email });
    if(!user) res.status(400).send('Email is not found!');
    //checking password
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if(!validPass) res.status(400).send('Invalid password!');
    //create and assign a token
    const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET);
    res.header('x-access-token', token).send(token);
})



module.exports = router;