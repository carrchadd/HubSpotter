const Feedback = require('../models/feedbackModel');

exports.sendFeedback = async (req, res) => {
    let feedback = new Feedback(req.body);
    feedback.save()
    .then(() => {
        res.json({ message: "Feedback sent" });
    })
    .catch(err => {
        res.status(400).json({ message: err.message });
    });
};