const location = require('../models/locationModel');

// save a location and save it to user
exports.saveLocation = async (req, res) => {
    let loc = new location(req.body);
    loc.save()
    .then( () => {
        try {
            const userId = req.body.userId; // change once JWT auth is finished
            const user = User.findById(userId)
            .then( () => {
                user.savedLocations.push(loc._id);
                user.save()
                .then( () => {
                    res.json({ message: "Location saved and added to user" });
                })
                .catch(err => {
                    res.status(400).json({ message: err.message });
                });
            })
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    })
    .catch(err => {
        res.status(400).json({ message: err.message });
    });
};