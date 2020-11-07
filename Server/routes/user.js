const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Role = require('../models/role');
const verifyToken = require('../middlewares/verifyToken');
const bcrypt = require('bcryptjs');

const authMiddleware = require('../middlewares/authMiddleware')

router.get('', [verifyToken, authMiddleware.isAdmin] , async (req, res) => {
    User.find({},{password: 0}, (err, users) =>{
        if(err){
            return res.status(404).json({
                ok: false,
                err
            });
        }
        res.status(200).json({users});
    }).populate('role');
})

router.get('/:user_id', [verifyToken, authMiddleware.isAdmin] , async (req, res) => {
    const _id = req.params.user_id;
    User.findOne({_id: _id},{password: 0}, (err, user) =>{
        if(err){
            return res.status(404).json({
                ok: false,
                err
            });
        }
        res.status(200).json({user});
    }).populate('role');
})

router.delete('/:user_id',  [verifyToken, authMiddleware.isAdmin] , async (req, res) => {
    const _id = req.params.user_id;
    User.deleteOne({_id: _id}, (err, user) => {
        if (err) {
            return res.status(404).json({
                err
            });
        }
        res.status(200).json({
            user
        });
    })
})

router.post('/changePassword', [verifyToken], async (req, res) => {
    const user = User.findOne({_id: req.user}, err => {
        if (err) {
            return res.status(404).json({
                err
            });
        }
    })
    //checking password
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if(!validPass){
         res.status(400).send('Invalid password!');
    }
    else{
        //hash password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(req.body.password, salt);
        user.save(err => {
            if (err) {
                res.status(500).send({ message: err });
                return;
            }
            res.send({ message: "Password was updated successfully!" });
        });
    }
})


module.exports = router;