const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/verifyToken');

router.get('/', verifyToken, async (req, res) => {
    res.send('Hello');
})

module.exports = router;