const mongoose = require('mongoose');
require('mongoose-long')(mongoose);
const { Types: { Long } } = mongoose;
const { Schema } = mongoose;

const UserDataSchema = new Schema({
    code: {type: String},
    tutor_names: {type: String },
    tutor_last_names: {type: String },
    tutor_phone: {type: String },
    names: {type: String },
    last_names: {type: String },
    birthday: {type: Date},
    sex: {type: String},
    course: {type: String },
    institution: {type: String },
    institution_commune: {type: String },
    institution_region: {type: String },
    email: {type: String, unique: true},
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    createdAtNumber: { type: Long, default: Date.now },
    updatedAtNumber: { type: Long, default: Date.now },    
    relation: { type: String },
    registered_via: { type: String }
});

// Sets the createdAt parameter equal to the current time
UserDataSchema.pre('save', next => {
    now = new Date();
    if(!this.createdAt) {
      this.createdAt = now;
    	this.createdAtNumber = Date.now;
    }
    if(!this.updatedAt) {
      this.updatedAt = now;
    	this.updatedAtNumber = Date.now;
    }
    next();
});

const myDB = mongoose.connection.useDb('neuronegameuser');
const UserData = myDB.model('UserData', UserDataSchema);

module.exports = UserData;