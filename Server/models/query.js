const mongoose = require('mongoose');
const { Schema } = mongoose;

const QuerySchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true},
    userEmail: {type: String},
    query: {type: String},
    title: {type: String},
    url: {type: String},
    localTimeStamp: {type: Date},
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Sets the createdAt parameter equal to the current time
QuerySchema.pre('save', next => {
    now = new Date();
    if(!this.createdAt) {
      this.createdAt = now;
    }
    if(!this.updatedAt) {
      this.updatedAt = now;
    }
    next();
});

module.exports = mongoose.model('Query', QuerySchema);