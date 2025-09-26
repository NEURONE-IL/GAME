const jwt = require('jsonwebtoken');

module.exports = function auth(req, res, next){
    // Try to get token from header first, then from query parameter
    const token = req.header('x-access-token') || req.query.token;
    //checking token is provided    
    if(!token) return res.status(401).send('No token provided!');
    //checking token
    try{
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = verified;
        next();
    }catch(err){
        res.status(401).send('Invalid token!');
    }
}