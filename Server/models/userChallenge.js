const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserChallengeSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true},
    challenge: { type: Schema.Types.ObjectId, ref: 'Challenge', required: true},
    date: {type: Date},
    answers: [
        {
            answer: {type: String, required: true},
            urls: [
              {
                url: {type: String},
              }
            ]
        }
    ],
    timeLeft: { type: Number },
    hintUsed: { type: Boolean, default: false},
    pointsObtained: { type: Number},
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Sets the createdAt parameter equal to the current time
UserChallengeSchema.pre('save', next => {
    now = new Date();
    if(!this.createdAt) {
      this.createdAt = now;
    }
    if(!this.updatedAt) {
      this.updatedAt = now;
    }
    next();
});

module.exports = mongoose.model('UserChallenge', UserChallengeSchema);