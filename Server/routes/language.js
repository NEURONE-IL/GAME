const express = require('express');
const router = express.Router();
const Language = require('../models/language');


const authMiddleware = require('../middlewares/authMiddleware');
const verifyToken = require('../middlewares/verifyToken');

router.get('' ,  [verifyToken, authMiddleware.isAdmin], async (req, res) => {
    Language.find({}, (err, languages) =>{
        if(err){
            return res.status(404).json({
                ok: false,
                err
            });
        }
        res.status(200).json({languages});
    });
});

module.exports = router;
