const mongoose = require('mongoose');
const { Schema } = mongoose;

const CredentialSchema = new Schema({
    token: {type: String},
    logged: {type: Boolean},
    registered: {type: Boolean},
    app_code: {type: String},
    sec: {type: Number},
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Sets the createdAt parameter equal to the current time
CredentialSchema.pre('save', next => {
    now = new Date();
    if(!this.createdAt) {
      this.createdAt = now;
    }
    if(!this.updatedAt) {
      this.updatedAt = now;
    }
    next();
});

module.exports = mongoose.model('Credential', CredentialSchema);