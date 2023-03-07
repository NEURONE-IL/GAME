const express = require('express');
const router = express.Router();
const Competence = require('../models/competence');


const authMiddleware = require('../middlewares/authMiddleware');
const verifyToken = require('../middlewares/verifyToken');

router.get('' ,  [verifyToken, authMiddleware.isAdmin], async (req, res) => {
    Competence.find({}, (err, competences) =>{
        if(err){
            return res.status(404).json({
                ok: false,
                err
            });
        }
        res.status(200).json({competences});
    });
});

module.exports = router;
