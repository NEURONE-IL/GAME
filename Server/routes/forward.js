const express = require('express');
const router = express.Router();
const Forward = require('../models/forward');

const verifyToken = require('../middlewares/verifyToken');

router.get('/:course' , async (req, res) => {
    const course = req.params.course;
    Forward.findOne({course: course}, (err, forward) =>{
        if(err){
            return res.status(404).json({
                ok: false,
                err
            });
        }
        res.status(200).json({forward});
    });
});

router.post('', async (req, res) => {
    const course = req.body.course;
    const lastLink = req.body.lastLink;
    Forward.findOne({course: course}, (err, forward) =>{
        if(err){
            return res.status(404).json({
                ok: false,
                err
            });
        }
        if(!forward){
            let forward = new Forward({
                course: course,
                lastLink: lastLink
            });
            forward.save(err => {
                if(err){
                    return res.status(404).json({
                        ok: false,
                        err
                    });
                }
                else{
                    res.status(200).json({forward});
                }
            });
        }
        else{
            forward.lastLink = lastLink;
            forward.updatedAt = Date.now();
            forward.save(err => {
                if(err){
                    return res.status(404).json({
                        ok: false,
                        err
                    });
                }
                else{
                    res.status(200).json({forward});
                }
            });
        }
    });
});



module.exports = router;