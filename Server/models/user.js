const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
    email: {type: String, required: true, unique: true},
    confirmed: {type: Boolean, default: false},
    tutor_names: {type: String },
    tutor_last_names: {type: String },
    tutor_rut: {type: String },
    tutor_phone: {type: String },
    names: {type: String },
    last_names: {type: String },
    birthday: {type: Date, required: true},
    course: {type: String },
    institution: {type: String },
    institution_commune: {type: String },
    institution_region: {type: String },
    password: {type: String, required: true},
    gm_code: {type: String},
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    role: { type: Schema.Types.ObjectId, ref: 'Role', required: true},
    study: { type: Schema.Types.ObjectId, ref: 'Study'},
    assent: {type: Boolean, default: false},
    initialQuestionnaire: {type: Boolean, default: false}
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

module.exports = mongoose.model('User', UserSchema);