const jwt = require('jsonwebtoken');
const Site = require('../models/site');

module.exports = function auth(req, res, next){
    const token = req.header('x-api-key');
    //checking token is provided    
    if(!token) return res.status(401).send('No key provided!');
    const host = req.headers.referer;
    Site.findOne({host: host}, (err, site) => {
        if(err || !site){
            res.status(401).send('Not authorized');
        }
        //checking token
        if(token === site.api_key){
            req.site = site;
            next();
        }
        else{
            res.status(400).send('Invalid key!');
        }
    })
}