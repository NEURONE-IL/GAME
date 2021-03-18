const mongoose = require('mongoose');
const { Schema } = mongoose;


const UserDataSchema = new Schema({
    code: {type: String},
    tutor_names: {type: String },
    tutor_last_names: {type: String },
    tutor_phone: {type: String },
    names: {type: String },
    last_names: {type: String },
    birthday: {type: Date},
    course: {type: String },
    institution: {type: String },
    institution_commune: {type: Number },
    institution_region: {type: Number },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    relation: { type: String }
});

// Sets the createdAt parameter equal to the current time
UserDataSchema.pre('save', next => {
    now = new Date();
    if(!this.createdAt) {
      this.createdAt = now;
    }
    if(!this.updatedAt) {
      this.updatedAt = now;
    }
    next();
});

const myDB = mongoose.connection.useDb('neuronegameuser');
const UserData = myDB.model('UserData', UserDataSchema);

module.exports = UserData;