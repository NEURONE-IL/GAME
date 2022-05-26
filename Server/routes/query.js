const express = require('express');
const router = express.Router();
const Query = require('../models/query');

const authMiddleware = require('../middlewares/authMiddleware');
const verifyToken = require('../middlewares/verifyToken');

router.get('', [verifyToken] , async (req, res) => {
    Query.find({}, (err, querys) =>{
        if(err){
            return res.status(404).json({
                ok: false,
                err
            });
        }
        return res.status(200).json({querys});
    });
})

router.get('/:query_id', [verifyToken] , async (req, res) => {
    const _id = req.params.query_id;
    Query.findOne({_id: _id}, (err, query) =>{
        if(err){
            return res.status(404).json({
                ok: false,
                err
            });
        }
        return res.status(200).json({query});
    });
});

router.post('',  [verifyToken], async (req, res) => {
    const query = new Query(req.body);
    query.save((err, query) => {
        if (err) {
            return res.status(404).json({
                err
            });
        }
        return res.status(200).json({
            query
        });
    })
});


router.delete('/:query_id',  [verifyToken, authMiddleware.isAdmin] , async (req, res) => {
    const _id = req.params.query_id;
    Query.deleteOne({_id: _id}, (err, query) => {
        if (err) {
            return res.status(404).json({
                err
            });
        }
        return res.status(200).json({
            query
        });
    })
})


module.exports = router;