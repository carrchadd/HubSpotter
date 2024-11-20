const mongoose = require('mongoose');
const locationSchema = new mongoose.Schema({
    id: {
      type: Number,
      required: true,
      unique: true
    },
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
      match: /^[0-9+\-() ]{7,15}$/ // Allows numbers, spaces, +, -, ()
    },
    website: {
      type: String,
      required: false,
      trim: true,
      match: /^(https?:\/\/)?([\w\-]+)\.([a-z]{2,6})(\/[\w\-]*)*\/?$/ // Basic URL validation
    }
  });
  
  // Create the model
  const Location = mongoose.model('Location', locationSchema);
