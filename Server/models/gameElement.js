const mongoose = require('mongoose');
const { Schema } = mongoose;

const GameElementSchema = new Schema({
    type: {type: String, required: true},
    key: {type: String, required: true, unique: true},
    gm_code: {type: String, required: true},
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Sets the createdAt parameter equal to the current time
GameElementSchema.pre('save', next => {
    now = new Date();
    if(!this.createdAt) {
      this.createdAt = now;
    }
    if(!this.updatedAt) {
      this.updatedAt = now;
    }
    next();
});

module.exports = mongoose.model('GameElement', GameElementSchema);