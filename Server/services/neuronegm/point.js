const axios = require("axios");
const connect = require('./connect');
const pointsJson = require('../../config/neuronegm/points.json');
const GameElement = require('../../models/gameElement');

const getPoints = async (callback) => {
    await connect.getHeadersGM((err, headers) => {
        let credential = headers.credential;
        if(err){
            callback(err)
        }
        axios.get(process.env.NEURONEGM+'/api/'+credential.app_code+'/points',headers.headers ).then((response)=> {
            callback(null, response.data.data)
        }).catch((err) => {
            callback(err);
        })
    });
}

const postPoint = async (point, callback) => {
    await connect.getHeadersGM((err, headers) => {
        let credential = headers.credential;
        if(err){
            callback(err)
        }
        axios.post(process.env.NEURONEGM+'/api/'+credential.app_code+'/points', point, headers.headers  ).then((response)=> {
            callback(null, response.data.data)
        }).catch((err) => {
            callback(err);
        })
    });
}

const postAllPoints = async(callback) => {
    let points = pointsJson.points;
    let newGameElem;
    for(let i = 0; i<points.length; i++){
        await postPoint(points[i], (err, point) => {
            if(err){
                console.log(err)
            }
            newGameElem = new GameElement({
                type: "point",
                key: points[i].key,
                gm_code: point.code
            })
            newGameElem.save();
        })
    }
    callback(null);
}

const updatePoint = async (point, code, callback) => {
    await connect.getHeadersGM((err, headers) => {
        let credential = headers.credential;
        if(err){
            callback(err)
        }
        axios.put(process.env.NEURONEGM+'/api/'+credential.app_code+'/points/'+code, point, headers.headers  ).then((response)=> {
            callback(null, response.data.data)
        }).catch((err) => {
            callback(err);
        })
    });
}

const deletePoint = async (code, callback) => {
    await connect.getHeadersGM((err, headers) => {
        let credential = headers.credential;
        if(err){
            callback(err)
        }
        axios.delete(process.env.NEURONEGM+'/api/'+credential.app_code+'/points/'+code, headers.headers  ).then((response)=> {
            callback(null, response.data.data)
        }).catch((err) => {
            callback(err);
        })
    });
}

const point = {
    getPoints,
    postPoint,
    postAllPoints,
    updatePoint,
    deletePoint
};

module.exports = point;
