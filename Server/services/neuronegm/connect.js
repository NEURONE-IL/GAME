const axios = require("axios");
const Credential = require('../../models/credential');

const loginGM = async (credential, callback) => {
    await axios.post(process.env.NEURONEGM+'/auth/signin', {username: 'neuronegame', password: 'neuroneclient'}).then((response)=> {
        credential.logged = true;
        credential.token = response.data.data.accessToken;
        credential.updatedAt = new Date();
        console.log("Logged into NEURONE GM ")
        credential.save(err => {
            if(err){
                callback(err)
            }
            callback(null)
        });
    }).catch((err) => {
        callback(err);
    })
}
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
        if(err){
            callback(err)
        }
        axios.post(process.env.NEURONEGM+'/api/applications', {name: "game", description: "neurone game"}, headers.headers ).then((response)=> {
            callback(null, response.data.data)
        }).catch((err) => {
            callback(err);
        })
    });
}

const pingGM = async (callback) => {
    axios.get(process.env.NEURONEGM+'/auth/ping').then((response) => {
        callback(null, response.data)
    }).catch(err => {
        callback(err);
    })
}

const checkToken = async (callback) => {
    await getHeadersGM((err, headers) => {
        if(err){
            callback(err)
        }
        axios.get(process.env.NEURONEGM+'/auth/checkToken',  headers.headers ).then((response)=> {
            callback(null, response.data)
        }).catch(err => {
            callback(err);
        })
    });
}

const connect = {
    registerGM,
    connectGM,
    loginGM,
    getHeadersGM,
    pingGM,
    checkToken
};

module.exports = connect;