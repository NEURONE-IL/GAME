const mongoose = require('mongoose');
const { Schema } = mongoose;

const KeystrokeSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true},
    userEmail: {type: String},
    type: {type: String},
    source: {type: String},
    url: {type: String},
    which: {type: Number},
    keyCode: {type: Number},
    charCode: {type: Number},
    key: {type: String},
    chr: {type: String},
    localTimeStamp: {type: Date},
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Sets the createdAt parameter equal to the current time
KeystrokeSchema.pre('save', next => {
    now = new Date();
    if(!this.createdAt) {
      this.createdAt = now;
    }
    if(!this.updatedAt) {
      this.updatedAt = now;
    }
    next();
});

module.exports = mongoose.model('Keystroke', KeystrokeSchema);