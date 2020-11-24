const mongoose = require('mongoose');
const { Schema } = mongoose;

const ChallengeSchema = new Schema({
    question: {type: String, required: true},
    number: {type: Number},
    seconds: {type: Number, required: true},
    domain: {type: String},
    locale: {type: String},
    task: {type: String},
    hint: {type: String},
    answer_type: {type: String},
    answer: {type: String, required: true},
    study: { type: Schema.Types.ObjectId, ref: 'Study', required: true},
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Sets the createdAt parameter equal to the current time
ChallengeSchema.pre('save', next => {
    now = new Date();
    if(!this.createdAt) {
      this.createdAt = now;
    }
    if(!this.updatedAt) {
      this.updatedAt = now;
    }
    next();
});

module.exports = mongoose.model('Challenge', ChallengeSchema);