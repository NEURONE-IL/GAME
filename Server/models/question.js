const mongoose = require('mongoose');
const { Schema } = mongoose;

const QuestionSchema = new Schema({
    question: {type: String, required: true},
    seconds: {type: Number, required: true},
    domain: {type: String, required: true},
    locale: {type: String, required: true, unique: true},
    task: {type: String, required: true},
    hint: {type: String, required: true},
    createdAt: { type: Date, default: Date.now }
});

// Sets the createdAt parameter equal to the current time
QuestionSchema.pre('save', next => {
    now = new Date();
    if(!this.createdAt) {
      this.createdAt = now;
    }
    next();
});

module.exports = mongoose.model('Question', QuestionSchema);