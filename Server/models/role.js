const mongoose = require('mongoose');
const { Schema } = mongoose;

const RoleSchema = new Schema({
    name: {type: String, required: true, unique: true},
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Sets the createdAt parameter equal to the current time
RoleSchema.pre('save', next => {
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
const Role = myDB.model('Role', RoleSchema);

module.exports = Role;
