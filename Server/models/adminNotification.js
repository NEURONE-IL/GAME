const mongoose = require('mongoose');
const { Schema } = mongoose;

const AdminNotificationSchema = new Schema({
    userFrom: { type: Schema.Types.ObjectId, ref: 'User', required: true},
    userTo: { type: Schema.Types.ObjectId, ref: 'User', required: true},
    type: { type: String},
    invitation: { type: Schema.Types.ObjectId, ref: 'Invitation'},
    history: { type: Schema.Types.ObjectId, ref: 'History'},
    description: { type: String },
    seen: { type: Boolean },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Sets the createdAt parameter equal to the current time
AdminNotificationSchema.pre('save', next => {
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
const AdminNotification = myDB.model('AdminNotification', AdminNotificationSchema);

module.exports = AdminNotification;