const axios = require("axios");
const Credential = require('../../models/credential');

const getHeadersGM = async (callback) => {
    await Credential.findOne({sec: 1}, (err, credential) => {
        if(err){
            callback(err)
        }
        callback(null, {headers: {headers: {"x-access-token": credential.token}}, credential: credential});
    });
}

const connect = {
    getHeadersGM
};

module.exports = connect;