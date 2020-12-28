const mongoose = require('mongoose');
const { Schema } = mongoose;

const NotificationSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true},
    name: { type: String},
    type: { type: String},
    element_code: { type: String },
    messageES: { type: String},
    messageEN: { type: String},
    acquisitionDate: { type: Date },
    notificationDate: { type: Date },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Sets the createdAt parameter equal to the current time
NotificationSchema.pre('save', next => {
    now = new Date();
    if(!this.createdAt) {
      this.createdAt = now;
    }
    if(!this.updatedAt) {
      this.updatedAt = now;
    }
    next();
});

module.exports = mongoose.model('Notification', NotificationSchema);