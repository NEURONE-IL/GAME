const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Token = require('../models/token');

// Token confirmation
// Adapted from: https://codemoto.io/coding/nodejs/email-verification-node-express-mongodb
router.get('/confirmation/:token', async(req, res)=> {

    // Get token from params
    const providedToken = req.params.token;

    // Find a matching token
    Token.findOne({ token: providedToken }, function (err, token) {
        if (!token) return res.status(400).send({ type: 'not-verified', msg: 'We were unable to find a valid token. Your token my have expired.' });

        // If found, find matching user
        User.findOne({ _id: token._userId }, function (err, user) {
            if (!user) return res.status(400).send({ type: 'USER_NOT_FOUND', msg: 'We were unable to find a user for this token.' });
            if (user.confirmed) return res.status(400).send({ type: 'USER_ALREADY_CONFIRMED', msg: 'This user has already been confirmed.' });
 
            // Verify and save the user
            user.confirmed = true;
            user.save(function (err) {
                if (err) { return res.status(500).send({ msg: err.message }); }
                res.status(200).send({type:"USER_CONFIRMED", msg:"The account has been confirmed."});
            });
        });
    });
});

module.exports = router;