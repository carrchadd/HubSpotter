const mongoose = require('mongoose');
const locationSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      trim: true
    },
    address: {
      type: String,
      required: true,
      trim: true
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    phone: {
      type: String,
      required: false,
      trim: true,
     
    },
    website: {
      type: String,
      required: false,
      trim: true,
      
    },
    placeId: String
  });
  

module.exports = mongoose.model('Location', locationSchema);
