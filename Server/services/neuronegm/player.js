const axios = require("axios");
const connect = require('./connect');

const getPlayers = async (callback) => {
    await connect.getHeadersGM((err, headers) => {
        if(err){
            callback(err)
        }
        else{
            let credential = headers.credential;
            axios.get(process.env.NEURONEGM+'/api/'+credential.app_code+'/players',headers.headers ).then((response)=> {
                callback(null, response.data.data)
            }).catch((err) => {
                callback(err);
            })
        }
    });
}

const postPlayer = async (player, callback) => {
    await connect.getHeadersGM((err, headers) => {
        if(err){
            callback(err)
        }
        else{
            let credential = headers.credential;
            axios.post(process.env.NEURONEGM+'/api/'+credential.app_code+'/players', player, headers.headers ).then((response)=> {
                callback(null, response.data.data)
            }).catch((err) => {
                callback(err);
            })
        }
    });
}

const updatePlayer = async (player, code, callback) => {
    await connect.getHeadersGM((err, headers) => {
        if(err){
            callback(err)
        }
        else{
            let credential = headers.credential;
            axios.put(process.env.NEURONEGM+'/api/'+credential.app_code+'/players/'+code, player, headers.headers ).then((response)=> {
                callback(null, response.data.data)
            }).catch((err) => {
                callback(err);
            })
        }
    });
}

const deletePlayer = async (code, callback) => {
    await connect.getHeadersGM((err, headers) => {
        if(err){
            callback(err)
        }
        else{
            let credential = headers.credential;
            axios.delete(process.env.NEURONEGM+'/api/'+credential.app_code+'/players/'+code, headers.headers ).then((response)=> {
                callback(null, response.data.data)
            }).catch((err) => {
                callback(err);
            })
        }
    });
}

const getPlayersByGroup = async (group_code, callback) => {
    await connect.getHeadersGM((err, headers) => {
        if(err){
            callback(err)
        }
        else{
            let credential = headers.credential;
            axios.get(process.env.NEURONEGM+'/api/'+credential.app_code+'/players/by-group'+group_code, headers ).then((response)=> {
                callback(null, response.data.data)
            }).catch((err) => {
                callback(err);
            })
        }
    });
}

const getPlayersPoints = async (player_code, callback) => {
    await connect.getHeadersGM((err, headers) => {
        if(err){
            callback(err)
        }
        else{
            let credential = headers.credential;
            axios.get(process.env.NEURONEGM+'/api/'+credential.app_code+'/players/'+player_code+'/player-points', headers.headers ).then((response)=> {
                callback(null, response.data.data)
            }).catch((err) => {
                callback(err);
            })
        }
    });
}

const getPlayerLevels = async (player_code, callback) => {
    await connect.getHeadersGM((err, headers) => {
        if(err){
            callback(err)
        }
        else{
            let credential = headers.credential;
            axios.get(process.env.NEURONEGM+'/api/'+credential.app_code+'/players/'+player_code+'/player-levels', headers.headers ).then((response)=> {
                callback(null, response.data.data)
            }).catch((err) => {
                callback(err);
            })
        }
    });
}

const getPlayerChallenges = async (player_code, callback) => {
    await connect.getHeadersGM((err, headers) => {
        if(err){
            callback(err)
        }
        else{
            let credential = headers.credential;
            axios.get(process.env.NEURONEGM+'/api/'+credential.app_code+'/players/'+player_code+'/completed-challenges', headers.headers ).then((response)=> {
                callback(null, response.data.data)
            }).catch((err) => {
                callback(err);
            })
        }
    });
}

const getPlayersBadges = async (player_code, callback) => {
    await connect.getHeadersGM((err, headers) => {
        if(err){
            callback(err)
        }
        else{
            let credential = headers.credential;
            axios.get(process.env.NEURONEGM+'/api/'+credential.app_code+'/players/'+player_code+'/badges', headers.headers ).then((response)=> {
                callback(null, response.data.data)
            }).catch((err) => {
                callback(err);
            })
        }
    });
};

const getPlayerActions = async (player_code, callback) => {
    await connect.getHeadersGM((err, headers) => {
        if(err){
            callback(err)
        }
        else{
            let credential = headers.credential;
            axios.get(process.env.NEURONEGM+'/api/'+credential.app_code+'/players/'+player_code+'/actions', headers.headers ).then((response)=> {
                callback(null, response.data.data)
            }).catch((err) => {
                callback(err);
            })
        }
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
    getPlayersBadges,
    getPlayerActions
};

module.exports = player;
