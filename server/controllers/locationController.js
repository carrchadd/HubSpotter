const location = require('../models/locationModel');
const User = require('../models/userModel');

// save a location and save it to user
exports.saveLocation = async (req, res) => {
    let loc = new location(req.body);
    loc.save()
    .then( () => {
        try {
            const userId = req.user.id; // change once JWT auth is finished
            const user = User.findById(userId)
            .then( foundUser => {
                foundUser.savedLocations.push(loc._id);
                foundUser.save()
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