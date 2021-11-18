const { any, boolean } = require('joi');
const mongoose = require('mongoose');
const { Schema } = mongoose;


const UserSchema = new Schema({
    email: {type: String, required: true, unique: true},
    confirmed: {type: Boolean, default: false},
    names: {type: String },
    last_names: {type: String },
    password: {type: String, required: true},
    gm_code: {type: String},
    cooldown_start: {type: Date},
    interval_answers: {type: Number},
    image_url: {type: String},
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    role: { type: Schema.Types.ObjectId, ref: 'Role', required: true },
    study: { type: Schema.Types.ObjectId, ref: 'Study' },
    trainer_id: {type: String},
    code: {type: String},
    has_played: {type: Boolean, default: false},
    registered_via: {type: String}
});

// Sets the createdAt parameter equal to the current time
UserSchema.pre('save', next => {
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
const User = myDB.model('User', UserSchema);

module.exports = User;