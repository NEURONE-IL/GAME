const mongoose = require('mongoose');
const { Schema } = mongoose;

const MetricsSchema = new Schema({
  _id: {type: String, required: true},
  type: {type: String, required: true},
  userId: {type: String, ref: 'User', required: true },
  value: {type: Number, required: true},
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Sets the createdAt and updatedAt parameters equal to the current time
MetricsSchema.pre('save', function(next) {
    let now = new Date();
    if(!this.createdAt) {
      this.createdAt = now;
    }
    if(!this.updatedAt) {
      this.updatedAt = now;
    }
    next();
});

const myDB = mongoose.connection.useDb('neuronegame');
const Metrics = myDB.model('Metrics', MetricsSchema);

module.exports = Metrics;
