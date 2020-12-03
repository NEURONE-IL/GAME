const express = require('express');
const router = express.Router();
const point = require('../services/neuronegm/point')


const verifyToken = require('../middlewares/verifyToken');

router.get('' , async (req, res) => {
    await point.getPoints((err, points) => {
        if(err){
            res.status(404).send(err);
        }
        res.status(200).send(points);
    })
})


module.exports = router;