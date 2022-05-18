const mongoose = require('mongoose');
require('mongoose-long')(mongoose);
const { Types: { Long } } = mongoose;
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
                number: { type: Number},
                _id: false
              }
            ],
            _id: false
        }
    ],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    createdAtNumber: { type: Long, default: Date.now },
    updatedAtNumber: { type: Long, default: Date.now }
});

// Sets the createdAt parameter equal to the current time
QuestionnaireSchema.pre('save', next => {
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
const Questionnaire = myDB.model('Questionnaire', QuestionnaireSchema);

module.exports = Questionnaire;