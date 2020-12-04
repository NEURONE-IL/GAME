const axios = require("axios");
const connect = require('./connect');

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

const postLevel = async (point, callback) => {
    await connect.getHeadersGM((err, headers) => {
        let credential = headers.credential;
        if(err){
            callback(err)
        }
        axios.post(process.env.NEURONEGM+'/api/'+credential.app_code+'/levels', point, headers ).then((response)=> {
            callback(null, response.data.data)
        }).catch((err) => {
            callback(err);
        })
    });
}

const updateLevel = async (point, code, callback) => {
    await connect.getHeadersGM((err, headers) => {
        let credential = headers.credential;
        if(err){
            callback(err)
        }
        axios.put(process.env.NEURONEGM+'/api/'+credential.app_code+'/levels/'+code, point, headers ).then((response)=> {
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
        axios.delete(process.env.NEURONEGM+'/api/'+credential.app_code+'/levels/'+code, headers ).then((response)=> {
            callback(null, response.data.data)
        }).catch((err) => {
            callback(err);
        })
    });
}

const level = {
    getLevels,
    postLevel,
    updateLevel,
    deleteLevel
};

module.exports = level;
