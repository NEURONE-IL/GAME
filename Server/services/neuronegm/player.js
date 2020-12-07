const axios = require("axios");
const connect = require('./connect');

const getPlayers = async (callback) => {
    await connect.getHeadersGM((err, headers) => {
        let credential = headers.credential;
        if(err){
            callback(err)
        }
        axios.get(process.env.NEURONEGM+'/api/'+credential.app_code+'/players',headers ).then((response)=> {
            callback(null, response.data.data)
        }).catch((err) => {
            callback(err);
        })
    });
}

const postPlayer = async (player, callback) => {
    await connect.getHeadersGM((err, headers) => {
        let credential = headers.credential;
        if(err){
            callback(err)
        }
        axios.post(process.env.NEURONEGM+'/api/'+credential.app_code+'/players', player, headers ).then((response)=> {
            callback(null, response.data.data)
        }).catch((err) => {
            callback(err);
        })
    });
}

const updatePlayer = async (player, code, callback) => {
    await connect.getHeadersGM((err, headers) => {
        let credential = headers.credential;
        if(err){
            callback(err)
        }
        axios.put(process.env.NEURONEGM+'/api/'+credential.app_code+'/players/'+code, player, headers ).then((response)=> {
            callback(null, response.data.data)
        }).catch((err) => {
            callback(err);
        })
    });
}

const deletePlayer = async (code, callback) => {
    await connect.getHeadersGM((err, headers) => {
        let credential = headers.credential;
        if(err){
            callback(err)
        }
        axios.delete(process.env.NEURONEGM+'/api/'+credential.app_code+'/players/'+code, headers ).then((response)=> {
            callback(null, response.data.data)
        }).catch((err) => {
            callback(err);
        })
    });
}

const getPlayersByGroup = async (group_code, callback) => {
    await connect.getHeadersGM((err, headers) => {
        let credential = headers.credential;
        if(err){
            callback(err)
        }
        axios.delete(process.env.NEURONEGM+'/api/'+credential.app_code+'/players/by-group'+group_code, headers ).then((response)=> {
            callback(null, response.data.data)
        }).catch((err) => {
            callback(err);
        })
    });
}

const getPlayersPoints = async (player_code, callback) => {
    await connect.getHeadersGM((err, headers) => {
        let credential = headers.credential;
        if(err){
            callback(err)
        }
        axios.delete(process.env.NEURONEGM+'/api/'+credential.app_code+'/players/'+player_code+'/player-points', headers ).then((response)=> {
            callback(null, response.data.data)
        }).catch((err) => {
            callback(err);
        })
    });
}

const getPlayerLevels = async (player_code, callback) => {
    await connect.getHeadersGM((err, headers) => {
        let credential = headers.credential;
        if(err){
            callback(err)
        }
        axios.delete(process.env.NEURONEGM+'/api/'+credential.app_code+'/players/'+player_code+'/player-levels', headers ).then((response)=> {
            callback(null, response.data.data)
        }).catch((err) => {
            callback(err);
        })
    });
}

const getPlayerChallenges = async (player_code, callback) => {
    await connect.getHeadersGM((err, headers) => {
        let credential = headers.credential;
        if(err){
            callback(err)
        }
        axios.delete(process.env.NEURONEGM+'/api/'+credential.app_code+'/players/'+player_code+'/completed-challenges', headers ).then((response)=> {
            callback(null, response.data.data)
        }).catch((err) => {
            callback(err);
        })
    });
}

const getPlayersBadges = async (player_code, callback) => {
    await connect.getHeadersGM((err, headers) => {
        let credential = headers.credential;
        if(err){
            callback(err)
        }
        axios.delete(process.env.NEURONEGM+'/api/'+credential.app_code+'/players/'+player_code+'/badges', headers ).then((response)=> {
            callback(null, response.data.data)
        }).catch((err) => {
            callback(err);
        })
    });
}

const player = {
    getPlayers,
    postPlayer,
    updatePlayer,
    deletePlayer,
    getPlayersByGroup,
    getPlayersPoints,
    getPlayerLevels,
    getPlayerChallenges,
    getPlayersBadges
};

module.exports = player;