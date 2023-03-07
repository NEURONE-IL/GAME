const mongoose = require('mongoose');
const { Schema } = mongoose;

const StudyAssistantSchema = new Schema({
    study: { type: Schema.Types.ObjectId, ref: 'Study', required: true, unique: true},
    assistant: {type: String, required: true},
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Sets the createdAt parameter equal to the current time
StudyAssistantSchema.pre('save', next => {
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
const StudyAssistant = myDB.model('StudyAssistant', StudyAssistantSchema);

module.exports = StudyAssistant;