const mongoose = require('mongoose');
require('mongoose-long')(mongoose);
const { Types: { Long } } = mongoose;
const { Schema } = mongoose;

const UserStudySchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true},
    study: { type: Schema.Types.ObjectId, ref: 'Study', required: true},
    assent: {type: Boolean, default: false},
    finished: {type: Boolean, default: false},
    finishedAt: { type: Date},
    post_study: {type: Boolean, default: false},    
    challenges: { type: [{
        challenge: {type: Schema.Types.ObjectId, ref: 'Challenge'},
        pre_test: {type: Boolean, default: false},
        post_test: {type: Boolean, default: false},
        started: {type: Boolean, default: false},
        start_time: { type: Date, default: undefined },
        answer_submitted: {type: Boolean, default: false},
        finished: {type: Boolean, default: false},
        _id: false
      }], default: []},
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    createdAtNumber: { type: Long, default: Date.now },
    updatedAtNumber: { type: Long, default: Date.now }    
});

// Sets the createdAt parameter equal to the current time
UserStudySchema.pre('save', next => {
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
const UserStudy = myDB.model('UserStudy', UserStudySchema);

module.exports = UserStudy;