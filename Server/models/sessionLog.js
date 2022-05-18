const mongoose = require('mongoose');
require('mongoose-long')(mongoose);
const { Types: { Long } } = mongoose;
const { Schema } = mongoose;

const SessionLogSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true},
    studyId: { type: Schema.Types.ObjectId, ref: 'Study'},
    challengeId: { type: Schema.Types.ObjectId, ref: 'Challenge'},
    state: {type: String},
    localTimeStamp: {type: Date},
    user_agent: {type: String},
    browser: {type: String},
    os: {type: String},
    device: {type: String},
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    createdAtNumber: { type: Long, default: Date.now },
    updatedAtNumber: { type: Long, default: Date.now }
});

// Sets the createdAt parameter equal to the current time
SessionLogSchema.pre('save', next => {
    now = new Date();
    if(!this.createdAt) {
    	this.createdAt = now;
    	this.createdAtNumber = Date.now;
    }
    if(!this.updatedAt) {
    	this.updatedAt = now;
    	this.updatedAtNumber = Date.now;
    }
    next();
});

const myDB = mongoose.connection.useDb('neuronegame');
const SessionLog = myDB.model('SessionLog', SessionLogSchema);

module.exports = SessionLog;