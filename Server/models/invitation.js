const mongoose = require('mongoose');
const { Schema } = mongoose;

const InvitationSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true},
    study: { type: Schema.Types.ObjectId, ref: 'Study'},
    status: {type: String},
    //timeStamp: {type: Date},
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Sets the createdAt parameter equal to the current time
InvitationSchema.pre('save', next => {
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
const Invitation = myDB.model('Invitation', InvitationSchema);

module.exports = Invitation;