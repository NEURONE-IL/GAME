const jwt = require('jsonwebtoken');
const Site = require('../models/site');

module.exports = function auth(req, res, next){
    const token = req.header('x-api-key');
    //checking token is provided    
    if(!token) return res.status(401).send('No key provided!');
    console.log(req.headers.origin);
    const host = req.headers.origin;
    Site.findOne({host: host}, (err, site) => {
        console.log(site);
        if(err || !site){
            res.status(401).send('Not authorized');
        }
        if(!site.confirmed){
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