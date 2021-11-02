const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserChallengeSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true},
    challenge: { type: Schema.Types.ObjectId, ref: 'Challenge', required: true},
    studyId: { type: Schema.Types.ObjectId, ref: 'Study'},
    date: {type: Date},
    answers: [
        {
            answer: {type: String, default: ""},
            urls: [
              {
                url: {type: String},
              }
            ]
        }
    ],
    timeLeft: { type: Number },
    hintUsed: { type: Boolean, default: false},
    distance: {type: Number},
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

const myDB = mongoose.connection.useDb('neuronegame');
const UserChallenge = myDB.model('UserChallenge', UserChallengeSchema);

module.exports = UserChallenge;