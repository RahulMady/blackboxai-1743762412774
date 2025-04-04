const mongoose = require('mongoose');
const { Schema } = mongoose;

const sensorSchema = new Schema({
  sensorId: {
    type: String,
    required: true,
    unique: true
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],  // [longitude, latitude]
      required: true
    }
  },
  temperature: Number,
  humidity: Number,
  airQuality: {
    co: Number,
    co2: Number,
    methane: Number
  },
  noiseLevel: Number,
  motionDetected: Boolean,
  fireDetected: Boolean,
  status: {
    type: String,
    enum: ['online', 'offline', 'maintenance'],
    default: 'online'
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Create 2dsphere index for geospatial queries
sensorSchema.index({ location: '2dsphere' });

const Sensor = mongoose.model('Sensor', sensorSchema);
module.exports = Sensor;