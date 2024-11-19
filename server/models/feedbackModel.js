const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const feedbackSchema = new Schema({
    rating: { type: Number, required: false},
    feedback: { type: String, required: [true, 'cannot be empty']}
}, {timestamps: {createdAt: true, updatedAt: false}});

module.exports = mongoose.model('Feedback', feedbackSchema);