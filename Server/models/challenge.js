const mongoose = require('mongoose');
require('mongoose-long')(mongoose);
const { Types: { Long } } = mongoose;
const { Schema } = mongoose;

const ChallengeSchema = new Schema({
    question: {type: String, required: true},
    question_type: {type: String, required: true},
    number: {type: Number},
    seconds: {type: Number, required: true},
    hint: {type: String},
    answer_type: {type: String, required: true},
    answer: {type: String, required: true},
    max_attempts: {type: Number, required:true},
    study: { type: Schema.Types.ObjectId, ref: 'Study', required: true},
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    createdAtNumber: { type: Long, default: Date.now },
    updatedAtNumber: { type: Long, default: Date.now }    
});

// Sets the createdAt parameter equal to the current time
ChallengeSchema.pre('save', next => {
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
const Challenge = myDB.model('Challenge', ChallengeSchema);

module.exports = Challenge;