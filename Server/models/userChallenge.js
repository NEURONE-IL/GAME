const mongoose = require('mongoose');
require('mongoose-long')(mongoose);
const { Types: { Long } } = mongoose;
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
                _id: false
              }
            ],
            _id: false
        }
    ],
    timeLeft: { type: Number },
    hintUsed: { type: Boolean, default: false},
    comment: { type: String },
    distance: {type: Number},
    pointsObtained: { type: Number},
    localTimeStamp: { type: Date },
    localTimeStampNumber: { type: Long },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    createdAtNumber: { type: Long, default: Date.now },
    updatedAtNumber: { type: Long, default: Date.now }    
});

// Sets the createdAt parameter equal to the current time
UserChallengeSchema.pre('save', next => {
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
const UserChallenge = myDB.model('UserChallenge', UserChallengeSchema);

module.exports = UserChallenge;