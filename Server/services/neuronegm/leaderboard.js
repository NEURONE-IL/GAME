const axios = require("axios");
const connect = require('./connect');

const getLeaderboards = async (callback) => {
    await connect.getHeadersGM((err, headers) => {
        let credential = headers.credential;
        if(err){
            callback(err)
        }
        axios.get(process.env.NEURONEGM+'/api/'+credential.app_code+'/leaderboards',headers.headers ).then((response)=> {
            callback(null, response.data.data)
        }).catch((err) => {
            callback(err);
        })
    });
}

const postLeaderboard = async (leaderboard, callback) => {
    await connect.getHeadersGM((err, headers) => {
        let credential = headers.credential;
        if(err){
            callback(err)
        }
        axios.post(process.env.NEURONEGM+'/api/'+credential.app_code+'/leaderboards', leaderboard, headers ).then((response)=> {
            callback(null, response.data.data)
        }).catch((err) => {
            callback(err);
        })
    });
}

const updateLeaderboard = async (leaderboard, code, callback) => {
    await connect.getHeadersGM((err, headers) => {
        let credential = headers.credential;
        if(err){
            callback(err)
        }
        axios.put(process.env.NEURONEGM+'/api/'+credential.app_code+'/leaderboards/'+code, leaderboard, headers ).then((response)=> {
            callback(null, response.data.data)
        }).catch((err) => {
            callback(err);
        })
    });
}

const deleteLeaderboard = async (code, callback) => {
    await connect.getHeadersGM((err, headers) => {
        let credential = headers.credential;
        if(err){
            callback(err)
        }
        axios.delete(process.env.NEURONEGM+'/api/'+credential.app_code+'/leaderboards/'+code, headers ).then((response)=> {
            callback(null, response.data.data)
        }).catch((err) => {
            callback(err);
        })
    });
}

const leaderboard = {
    getLeaderboards,
    postLeaderboard,
    updateLeaderboard,
    deleteLeaderboard
};

module.exports = leaderboard;
