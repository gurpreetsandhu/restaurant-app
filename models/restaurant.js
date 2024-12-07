const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
  restaurant_id: { type: Number, required: true },
  name: String,
  borough: String,
  cuisine: String,
  grades: [{
            date: Date,
            grade: String,
            score: Number,
          }],
  address: {
    street: String,
    building: String,
    zipcode: String,
    coord: [Number],
  }
});

module.exports = mongoose.model('Restaurant', restaurantSchema);