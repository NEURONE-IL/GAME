const axios = require("axios");
const connect = require('./connect');

const getGroups = async (callback) => {
    await connect.getHeadersGM((err, headers) => {
        if(err){
            callback(err)
        }
        else{
            let credential = headers.credential;
            axios.get(process.env.NEURONEGM+'/api/'+credential.app_code+'/groups',headers.headers ).then((response)=> {
                callback(null, response.data.data)
            }).catch((err) => {
                callback(err);
            })
        }
    });
}

const postGroup = async (group, callback) => {
    await connect.getHeadersGM((err, headers) => {
        if(err){
            callback(err);
        }
        else{
            let credential = headers.credential;
            axios.post(process.env.NEURONEGM+'/api/'+credential.app_code+'/groups', group, headers.headers ).then((response)=> {
                callback(null, response.data.data)
            }).catch((err) => {
                callback(err);
            })
        }
    });
}

const group = {
    getGroups,
    postGroup
};

module.exports = group;
