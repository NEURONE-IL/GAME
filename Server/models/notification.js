const mongoose = require('mongoose');
require('mongoose-long')(mongoose);
const { Types: { Long } } = mongoose;
const { Schema } = mongoose;

const NotificationSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true},
    name: { type: String},
    type: { type: String},
    seen: { type: Boolean},
    element_code: { type: String },
    messageES: { type: String},
    messageEN: { type: String},
    acquisitionDate: { type: Date },
    notificationDate: { type: Date },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    createdAtNumber: { type: Long, default: Date.now },
    updatedAtNumber: { type: Long, default: Date.now }    
});

// Sets the createdAt parameter equal to the current time
NotificationSchema.pre('save', next => {
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

const myDB = mongoose.connection.useDb('neuronegame');
const Notification = myDB.model('Notification', NotificationSchema);

module.exports = Notification;