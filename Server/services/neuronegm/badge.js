const axios = require("axios");
const connect = require('./connect');

const getBadges = async (callback) => {
    await connect.getHeadersGM((err, headers) => {
        let credential = headers.credential;
        if(err){
            callback(err)
        }
        axios.get(process.env.NEURONEGM+'/api/'+credential.app_code+'/badges',headers.headers ).then((response)=> {
            callback(null, response.data.data)
        }).catch((err) => {
            callback(err);
        })
    });
}

const postBadge = async (badge, callback) => {
    await connect.getHeadersGM((err, headers) => {
        let credential = headers.credential;
        if(err){
            callback(err)
        }
        axios.post(process.env.NEURONEGM+'/api/'+credential.app_code+'/badges', badge, headers ).then((response)=> {
            callback(null, response.data.data)
        }).catch((err) => {
            callback(err);
        })
    });
}

const updateBadge = async (badge, code, callback) => {
    await connect.getHeadersGM((err, headers) => {
        let credential = headers.credential;
        if(err){
            callback(err)
        }
        axios.put(process.env.NEURONEGM+'/api/'+credential.app_code+'/badges/'+code, badge, headers ).then((response)=> {
            callback(null, response.data.data)
        }).catch((err) => {
            callback(err);
        })
    });
}

const deleteBadge = async (code, callback) => {
    await connect.getHeadersGM((err, headers) => {
        let credential = headers.credential;
        if(err){
            callback(err)
        }
        axios.delete(process.env.NEURONEGM+'/api/'+credential.app_code+'/badges/'+code, headers ).then((response)=> {
            callback(null, response.data.data)
        }).catch((err) => {
            callback(err);
        })
    });
}

const badge = {
    getBadges,
    postBadge,
    updateBadge,
    deleteBadge
};

module.exports = badge;
