const axios = require("axios");
const connect = require('./connect');
const actionsJson = require('../../config/neuronegm/actions.json');
const GameElement = require('../../models/gameElement');

const getActions = async (callback) => {
    await connect.getHeadersGM((err, headers) => {
        let credential = headers.credential;
        if(err){
            callback(err)
        }
        axios.get(process.env.NEURONEGM+'/api/'+credential.app_code+'/actions',headers.headers ).then((response)=> {
            callback(null, response.data.data)
        }).catch((err) => {
            callback(err);
        })
    });
}

const postAction = async (action, callback) => {
    await connect.getHeadersGM((err, headers) => {
        let credential = headers.credential;
        if(err){
            callback(err)
        }
        axios.post(process.env.NEURONEGM+'/api/'+credential.app_code+'/actions', action, headers.headers ).then((response)=> {
            callback(null, response.data.data)
        }).catch((err) => {
            callback(err);
        })
    });
}

const postAllActions = async(callback) => {
    let actions = actionsJson.actions;
    let newGameElem;
    for(let i = 0; i<actions.length; i++){
        await postAction(actions[i], (err, action) => {
            if(err){
                console.log(err)
            }
            newGameElem = new GameElement({
                type: "action",
                key: actions[i].key,
                gmCode: action.code
            })
            newGameElem.save();
        })
    }
    callback(null);
}

const updateAction = async (action, code, callback) => {
    await connect.getHeadersGM((err, headers) => {
        let credential = headers.credential;
        if(err){
            callback(err)
        }
        axios.put(process.env.NEURONEGM+'/api/'+credential.app_code+'/actions/'+code, action, headers.headers  ).then((response)=> {
            callback(null, response.data.data)
        }).catch((err) => {
            callback(err);
        })
    });
}

const deleteAction = async (code, callback) => {
    await connect.getHeadersGM((err, headers) => {
        let credential = headers.credential;
        if(err){
            callback(err)
        }
        axios.delete(process.env.NEURONEGM+'/api/'+credential.app_code+'/actions/'+code, headers.headers  ).then((response)=> {
            callback(null, response.data.data)
        }).catch((err) => {
            callback(err);
        })
    });
}

const action = {
    getActions,
    postAction,
    postAllActions,
    updateAction,
    deleteAction
};

module.exports = action;
