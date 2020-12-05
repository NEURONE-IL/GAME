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

const registerGM = async (callback) => {
    axios.post(process.env.NEURONEGM+'/auth/gm-signup',{username: "neuronegame", email: "neuronegame@client.cl", password: "neuroneclient"}).then((response)=> {
        callback(null, response.data.data)
    }).catch((err) => {
        callback(err);
    })
}

const connectGM = async (callback) => {
    await getHeadersGM((err, headers) => {
        let credential = headers.credential;
        if(err){
            callback(err)
        }
        axios.post(process.env.NEURONEGM+'/api/applications', {name: "game", description: "neurone game"}, headers ).then((response)=> {
            callback(null, response.data.data)
        }).catch((err) => {
            callback(err);
        })
    });
}

const connect = {
    getHeadersGM,
    registerGM,
    connectGM
};

module.exports = connect;