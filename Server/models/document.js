const mongoose = require('mongoose');
const { Schema } = mongoose;

const DocumentSchema = new Schema({
    docName: {type: String, required: true},
    docType: {type: String, required: true},
    title: {type: String, required: true},
    url: {type: String, required: true},
    domain: {type: String},
    locale: {type: String},
    task: {type: String},
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Sets the createdAt parameter equal to the current time
DocumentSchema.pre('save', next => {
    now = new Date();
    if(!this.createdAt) {
      this.createdAt = now;
    }
    if(!this.updatedAt) {
      this.updatedAt = now;
    }
    next();
});

module.exports = mongoose.model('Document', DocumentSchema);