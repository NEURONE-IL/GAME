const mongoose = require('mongoose');
const { Schema } = mongoose;

const QuestionnaireSchema = new Schema({
    name: {type: String, required: true},
    type: {type: String, required: true},
    questions: [
        {
            question: {type: String, required: true},
            number: { type: Number},
            options: [
              {
                option: {type: String, required: true},
                number: { type: Number}
              }
            ]            
        }
    ],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Sets the createdAt parameter equal to the current time
QuestionnaireSchema.pre('save', next => {
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
const Questionnaire = myDB.model('Questionnaire', QuestionnaireSchema);

module.exports = Questionnaire;