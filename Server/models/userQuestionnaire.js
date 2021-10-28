const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserQuestionnaireSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true},
    questionnaire: { type: Schema.Types.ObjectId, ref: 'Questionnaire', required: true},
    challenge: { type: Schema.Types.ObjectId, ref: 'Challenge', required: true},
    type: {type: String},
    answers: [
        {
            question: { type: String, required: true },
            answer: { type: mongoose.Schema.Types.Mixed, required: true },
            number: { type: Number}
        }
    ],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Sets the createdAt parameter equal to the current time
UserQuestionnaireSchema.pre('save', next => {
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
const UserQuestionnaire = myDB.model('UserQuestionnaire', UserQuestionnaireSchema);

module.exports = UserQuestionnaire;