const mongoose = require('mongoose');
require('mongoose-long')(mongoose);
const { Types: { Long } } = mongoose;
const { Schema } = mongoose;

const MouseClickSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true},
    studyId: { type: Schema.Types.ObjectId, ref: 'Study'},
    challengeId: { type: Schema.Types.ObjectId, ref: 'Challenge'},
    type: {type: String},
    source: {type: String},
    url: {type: String},
    x_win: {type: Number},
    y_win: {type: Number},
    w_win: {type: Number},
    h_win: {type: Number},
    x_doc: {type: Number},
    y_doc: {type: Number},
    w_doc: {type: Number},
    h_doc: {type: Number},
    localTimeStamp: {type: Date},
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    createdAtNumber: { type: Long, default: Date.now },
    updatedAtNumber: { type: Long, default: Date.now }
});

// Sets the createdAt parameter equal to the current time
MouseClickSchema.pre('save', next => {
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
const MouseClick = myDB.model('MouseClick', MouseClickSchema);

module.exports = MouseClick;