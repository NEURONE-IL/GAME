const axios = require("axios");
const connect = require('./connect');
const leaderboardsJson = require('../../config/neuronegm/leaderboards.json');
const GameElement = require('../../models/gameElement');


const getLeaderboards = async (callback) => {
    await connect.getHeadersGM((err, headers) => {
        if(err){
            callback(err)
        }
        else{
            let credential = headers.credential;
            axios.get(process.env.NEURONEGM+'/api/'+credential.app_code+'/leaderboards',headers.headers ).then((response)=> {
                callback(null, response.data.data)
            }).catch((err) => {
                callback(err);
            })
        }
    });
}

const postLeaderboard = async (leaderboard, callback) => {
    await connect.getHeadersGM((err, headers) => {
        let credential = headers.credential;
        if(err){
            callback(err)
        }
        axios.post(process.env.NEURONEGM+'/api/'+credential.app_code+'/leaderboards', leaderboard, headers.headers ).then((response)=> {
            callback(null, response.data.data)
        }).catch((err) => {
            callback(err);
        })
    });
}

const postAllLeaderboards = async(callback) => {
    let leaderboards = leaderboardsJson.leaderboards;
    let newGameElem;
    for(let i = 0; i<leaderboards.length; i++){
        await postLeaderboard(leaderboards[i], (err, leaderboard) => {
            if(err){
                console.log(err)
            }
            else{
                newGameElem = new GameElement({
                    type: "leaderboard",
                    key: leaderboards[i].key,
                    gm_code: leaderboard.code
                })
                newGameElem.save();
            }
        })
    }
    callback(null);
}

const updateLeaderboard = async (leaderboard, code, callback) => {
    await connect.getHeadersGM((err, headers) => {
        if(err){
            callback(err)
        }
        else{
            let credential = headers.credential;
            axios.put(process.env.NEURONEGM+'/api/'+credential.app_code+'/leaderboards/'+code, leaderboard, headers.headers ).then((response)=> {
                callback(null, response.data.data)
            }).catch((err) => {
                callback(err);
            })
        }
    });
}

const deleteLeaderboard = async (code, callback) => {
    await connect.getHeadersGM((err, headers) => {
        if(err){
            callback(err)
        }
        else{
            let credential = headers.credential;
            axios.delete(process.env.NEURONEGM+'/api/'+credential.app_code+'/leaderboards/'+code, headers.headers ).then((response)=> {
                callback(null, response.data.data)
            }).catch((err) => {
                callback(err);
            })
        }
    });
}

const leaderboard = {
    getLeaderboards,
    postLeaderboard,
    postAllLeaderboards,
    updateLeaderboard,
    deleteLeaderboard
};

module.exports = leaderboard;
