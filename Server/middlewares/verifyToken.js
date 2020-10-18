const jwt = require('jsonwebtoken');

module.exports = function auth(req, res, next){
    const token = req.header('x-access-token');
    //checking token is provided    
    if(!token) return res.status(401).send('No token provided!');
    //checking token
    try{
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = verified;
        next();
    }catch(err){
        res.status(400).send('Invalid token!');
    }
}