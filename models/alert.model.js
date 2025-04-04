const mongoose = require('mongoose');
const { Schema } = mongoose;

const alertSchema = new Schema({
  sensorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Sensor',
    required: true
  },
  type: {
    type: String,
    enum: ['fire', 'intrusion', 'air-quality', 'sensor-failure'],
    required: true
  },
  severity: {
    type: String,
    enum: ['critical', 'warning', 'info'],
    default: 'warning'
  },
  message: {
    type: String,
    required: true
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  resolved: {
    type: Boolean,
    default: false
  },
  resolvedAt: Date,
  resolvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

// Index for geospatial queries
alertSchema.index({ location: '2dsphere' });

const Alert = mongoose.model('Alert', alertSchema);
module.exports = Alert;