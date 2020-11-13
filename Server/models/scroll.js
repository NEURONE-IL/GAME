const mongoose = require('mongoose');
const { Schema } = mongoose;

const ScrollSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true},
    userEmail: {type: String},
    type: {type: String},
    source: {type: String},
    url: {type: String},
    x_scr: {type: Number},
    y_scr: {type: Number},
    w_win: {type: Number},
    h_win: {type: Number},
    w_doc: {type: Number},
    h_doc: {type: Number},
    localTimeStamp: {type: Date},
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Sets the createdAt parameter equal to the current time
ScrollSchema.pre('save', next => {
    now = new Date();
    if(!this.createdAt) {
      this.createdAt = now;
    }
    if(!this.updatedAt) {
      this.updatedAt = now;
    }
    next();
});

module.exports = mongoose.model('Scroll', ScrollSchema);