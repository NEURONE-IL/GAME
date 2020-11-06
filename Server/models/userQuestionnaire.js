const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserQuestionnaireSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true},
    questionnaire: { type: Schema.Types.ObjectId, ref: 'Questionnaire', required: true},
    type: {type: String},
    answers: [
        {
            question: {type: String, required: true},
            answer: {type: Number, required: true},
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

module.exports = mongoose.model('UserQuestionnaire', UserQuestionnaireSchema);