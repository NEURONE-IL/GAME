const axios = require("axios");
const Credential = require('../../models/credential');

const loginGM = async (credential, email, password, callback) => {
    await axios.post(process.env.NEURONEGM+'/auth/signin', {username: email, password: password}).then((response)=> {
        credential.logged = true;
        credential.token = response.data.data.accessToken;
        credential.updatedAt = new Date();
        console.log("Logged into NEURONE GM ")
        credential.save(err => {
            if(err){
                callback(err)
            }
            callback(null);
        });
    }).catch((err) => {
        console.log(err)
        callback(err);
    })
}
const getHeadersGM = async (callback) => {
    await pingGM((err, data) => {
        if(err){
            callback(err);
        }
        else{
            Credential.findOne({code: "superadmin"}, (err, credential) => {
                if(err){
                    callback(err)
                }
                callback(null, {headers: {headers: {"x-access-token": credential.token}}, credential: credential});
            });
        }
    }) 
}

const registerGM = async (email, password, callback) => {
    axios.post(process.env.NEURONEGM+'/auth/gm-signup',{username: email, email: email, password: password}).then((response)=> {
        callback(null, response.data.data)
    }).catch((err) => {
        callback(err);
    })
}

const createAppGM = async (credential, callback) => {
    await getHeadersGM((err, headers) => {
        if(err){
            callback(err)
        }
        axios.post(process.env.NEURONEGM+'/api/applications', {name: "game", description: "neurone game"}, headers.headers ).then((response)=> {
            credential.app_code = response.data.data.code;
            credential.save(err => {
                if(err){
                    return res.status(404).send(err);
                }
                callback(null)
            })
        }).catch((err) => {
            callback(err);
        })
    });
}

const connectGM = async(email, password, callback) => {
    let credential = await Credential.findOne({code: "superadmin"}, err => {
        if(err){
            callback(err);
        }
    })
    if(!credential){
        await registerGM(email, password, err => {
            if(err){
                callback(err)
            }
            console.log("Registered User on NEURONEGM");
            credential = new Credential({
                code: "superadmin",
                registered: true
            });
            credential.save(err => {
                if(err){
                    callback(err);
                }
                loginGM(credential, email, password, err => {
                    if(err){
                        callback(err);
                    }
                    createAppGM(credential, err => {
                        console.log("Registered APP on NEURONEGM");
                        if(err){
                            callback(err);
                        }
                        callback(null);
                    })
                })
            })
        })
    }
    else{
        callback(null)
    }
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
        let credential = headers.credential;
        if(err){
            callback(err)
        }
        axios.get(process.env.NEURONEGM+'/auth/checkToken',  headers.headers ).then((response)=> {
            callback(null, response.data)
        }).catch(err => {
            callback(err);
        })
    });
};

const postWebhooks = async (callback) => {
    await getHeadersGM((err, headers) => {
        if(err){
            callback(err)
        }
        let credential = headers.credential;
        let webhooks = {
            givePointsUrl: 'http://localhost:3090/api/notification/getPoints',
            challengeCompletedUrl: 'http://localhost:3090/api/notification/challengeCompleted',
            badgeAcquiredUrl: 'http://localhost:3090/api/notification/badgeAcquired',
            levelUpUrl: 'http://localhost:3090/api/notification/levelUp'
        }
        axios.put(process.env.NEURONEGM+'/api/'+credential.app_code+'/webhooks', webhooks, headers.headers ).then((response)=> {
            callback(null, response.data.data)
        }).catch((err) => {
            callback(err);
        });
    });
}


const connect = {
    registerGM,
    createAppGM,
    loginGM,
    connectGM,
    getHeadersGM,
    pingGM,
    postWebhooks,
    checkToken
};

module.exports = connect;