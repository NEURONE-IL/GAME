const express = require('express');
const router = express.Router();
const Scroll = require('../models/scroll');

const authMiddleware = require('../middlewares/authMiddleware');
const verifyToken = require('../middlewares/verifyToken');

router.get('', [verifyToken] , async (req, res) => {
    Scroll.find({}, (err, scrolls) =>{
        if(err){
            return res.status(404).json({
                ok: false,
                err
            });
        }
        res.status(200).json({scrolls});
    });
})

router.get('/:scroll_id', [verifyToken] , async (req, res) => {
    const _id = req.params.scroll_id;
    Scroll.findOne({_id: _id}, (err, scroll) =>{
        if(err){
            return res.status(404).json({
                ok: false,
                err
            });
        }
        res.status(200).json({scroll});
    });
});

router.post('',  [verifyToken], async (req, res) => {
    const scroll = new Scroll(req.body);
    scroll.save((err, scroll) => {
        if (err) {
            return res.status(404).json({
                err
            });
        }
        res.status(200).json({
            scroll
        });
    })
});


router.delete('/:scroll_id',  [verifyToken, authMiddleware.isAdmin] , async (req, res) => {
    const _id = req.params.scroll_id;
    Scroll.deleteOne({_id: _id}, (err, scroll) => {
        if (err) {
            return res.status(404).json({
                err
            });
        }
        res.status(200).json({
            scroll
        });
    })
})


module.exports = router;