const mongoose = require('mongoose');
require('mongoose-long')(mongoose);
const { Types: { Long } } = mongoose;
const { Schema } = mongoose;

const UserQuestionnaireSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    questionnaire: { type: Schema.Types.ObjectId, ref: 'Questionnaire', required: true },
    study: { type: Schema.Types.ObjectId, ref: 'Study', required: true },
    challenge: { type: Schema.Types.ObjectId, ref: 'Challenge' },
    type: {type: String},
    answers: [
        {
            question: { type: String, required: true },
            answer: { type: mongoose.Schema.Types.Mixed, required: true },
            number: { type: Number},
            _id: false
        }
    ],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    createdAtNumber: { type: Long, default: Date.now },
    updatedAtNumber: { type: Long, default: Date.now }    
});

// Sets the createdAt parameter equal to the current time
UserQuestionnaireSchema.pre('save', next => {
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
const UserQuestionnaire = myDB.model('UserQuestionnaire', UserQuestionnaireSchema);

module.exports = UserQuestionnaire;