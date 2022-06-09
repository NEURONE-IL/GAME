const mongoose = require('mongoose');
require('mongoose-long')(mongoose);
const { Types: { Long } } = mongoose;
const { Schema } = mongoose;

const StudyAssistantSchema = new Schema({
    study: { type: Schema.Types.ObjectId, ref: 'Study', required: true, unique: true},
    assistant: {type: String, required: true},
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    createdAtNumber: { type: Long, default: Date.now },
    updatedAtNumber: { type: Long, default: Date.now }    
});

// Sets the createdAt parameter equal to the current time
StudyAssistantSchema.pre('save', next => {
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
const StudyAssistant = myDB.model('StudyAssistant', StudyAssistantSchema);

module.exports = StudyAssistant;