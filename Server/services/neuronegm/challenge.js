const axios = require("axios");
const connect = require('./connect');
const challengesJson = require('../../config/neuronegm/challenges.json');
const GameElement = require('../../models/gameElement');

const getChallenges = async (callback) => {
    await connect.getHeadersGM((err, headers) => {
        if(err){
            callback(err)
        }
        else{
            let credential = headers.credential;
            axios.get(process.env.NEURONEGM+'/api/'+credential.app_code+'/challenges',headers.headers ).then((response)=> {
                callback(null, response.data.data)
            }).catch((err) => {
                callback(err);
            })
        }
    });
}

const postChallenge = async (challenge, callback) => {
    await connect.getHeadersGM((err, headers) => {
        if(err){
            callback(err)
        }
        else{
            let credential = headers.credential;
            axios.post(process.env.NEURONEGM+'/api/'+credential.app_code+'/challenges', challenge, headers.headers ).then((response)=> {
                callback(null, response.data.challenge)
            }).catch((err) => {
                callback(err);
            })
        }
    });
}

const postAllChallenges = async(callback) => {
    let challenges = challengesJson.challenges;
    let newGameElem;
    for(let i = 0; i<challenges.length; i++){
        await postChallenge(challenges[i], (err, challenge) => {
            if(err){
                console.log(err)
            }
            else{
                newGameElem = new GameElement({
                    type: "challenge",
                    key: challenges[i].key,
                    gm_code: challenge.code
                })
                newGameElem.save();
            }
        });
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
    callback(null);
}

const updateChallenge = async (challenge, code, callback) => {
    await connect.getHeadersGM((err, headers) => {
        if(err){
            callback(err)
        }
        else{
            let credential = headers.credential;
            axios.put(process.env.NEURONEGM+'/api/'+credential.app_code+'/challenges/'+code, challenge, headers.headers  ).then((response)=> {
                callback(null, response.data.data)
            }).catch((err) => {
                callback(err);
            })
        }
    });
}

const deleteChallenge = async (code, callback) => {
    await connect.getHeadersGM((err, headers) => {
        if(err){
            callback(err)
        }
        else{
            let credential = headers.credential;
            axios.delete(process.env.NEURONEGM+'/api/'+credential.app_code+'/challenges/'+code, headers.headers  ).then((response)=> {
                callback(null, response.data.data)
            }).catch((err) => {
                callback(err);
            })
        }
    });
}

const challenge = {
    getChallenges,
    postChallenge,
    postAllChallenges,
    updateChallenge,
    deleteChallenge
};

module.exports = challenge;
