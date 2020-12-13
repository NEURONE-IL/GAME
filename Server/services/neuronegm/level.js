const axios = require("axios");
const connect = require('./connect');
const levelsJson = require('../../config/neuronegm/levels.json');
const GameElement = require('../../models/gameElement');

const getLevels = async (callback) => {
    await connect.getHeadersGM((err, headers) => {
        let credential = headers.credential;
        if(err){
            callback(err)
        }
        axios.get(process.env.NEURONEGM+'/api/'+credential.app_code+'/levels',headers.headers ).then((response)=> {
            callback(null, response.data.data)
        }).catch((err) => {
            callback(err);
        })
    });
}

const postLevel = async (level, callback) => {
    await connect.getHeadersGM((err, headers) => {
        let credential = headers.credential;
        if(err){
            callback(err)
        }
        axios.post(process.env.NEURONEGM+'/api/'+credential.app_code+'/levels', level, headers.headers ).then((response)=> {
            callback(null, response.data.data)
        }).catch((err) => {
            callback(err);
        })
    });
}

const postAllLevels = async(callback) => {
    let levels = levelsJson.levels;
    for(let i = 0; i<levels.length; i++){
        await postLevel(levels[i], (err, level) => {
            if(err){
                callback(err)
            }
            newGameElem = new GameElement({
                type: "level",
                key: levels[i].key,
                gm_code: level.code
            })
            newGameElem.save();
        })
    }
    callback(null);
}

const updateLevel = async (level, code, callback) => {
    await connect.getHeadersGM((err, headers) => {
        let credential = headers.credential;
        if(err){
            callback(err)
        }
        axios.put(process.env.NEURONEGM+'/api/'+credential.app_code+'/levels/'+code, level, headers.headers ).then((response)=> {
            callback(null, response.data.data)
        }).catch((err) => {
            callback(err);
        })
    });
}

const deleteLevel = async (code, callback) => {
    await connect.getHeadersGM((err, headers) => {
        let credential = headers.credential;
        if(err){
            callback(err)
        }
        axios.delete(process.env.NEURONEGM+'/api/'+credential.app_code+'/levels/'+code, headers.headersheaders ).then((response)=> {
            callback(null, response.data.data)
        }).catch((err) => {
            callback(err);
        })
    });
}

const level = {
    getLevels,
    postLevel,
    postAllLevels,
    updateLevel,
    deleteLevel
};

module.exports = level;
