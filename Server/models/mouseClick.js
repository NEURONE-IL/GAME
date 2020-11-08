const mongoose = require('mongoose');
const { Schema } = mongoose;

const MouseClickSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true},
    userEmail: {type: String},
    type: {type: String},
    source: {type: String},
    url: {type: String},
    x_win: {type: Number},
    y_win: {type: Number},
    w_win: {type: Number},
    h_win: {type: Number},
    x_doc: {type: Number},
    y_doc: {type: Number},
    w_doc: {type: Number},
    h_doc: {type: Number},
    localDate: {type: Date},
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Sets the createdAt parameter equal to the current time
MouseClickSchema.pre('save', next => {
    now = new Date();
    if(!this.createdAt) {
      this.createdAt = now;
    }
    if(!this.updatedAt) {
      this.updatedAt = now;
    }
    next();
});

module.exports = mongoose.model('MouseClick', MouseClickSchema);