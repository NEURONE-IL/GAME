const mongoose = require('mongoose');
const { Schema } = mongoose;

const VisitedLinkSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true},
    userEmail: {type: String},
    state: {type: String},
    title: {type: String},
    url: {type: String},
    localDate: {type: Date},
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Sets the createdAt parameter equal to the current time
VisitedLinkSchema.pre('save', next => {
    now = new Date();
    if(!this.createdAt) {
      this.createdAt = now;
    }
    if(!this.updatedAt) {
      this.updatedAt = now;
    }
    next();
});

module.exports = mongoose.model('VisitedLink', VisitedLinkSchema);