const User = require("../models/userModel");
const jwt = require('jsonwebtoken');
const { DateTime } = require('luxon');

const createToken = (id) => {
    return jwt.sign({ id }, process.env.SECRET, { expiresIn: 60 * 60 * 24 });
}

// signup user
exports.signupUser = async (req, res) => {
    const user = new User(req.body);
    user.save()
    .then ((savedUser) => {
        // create the token
        const token = createToken(savedUser._id);
        res.status(201).json({
            message: "User successfully created",
            token});
    }
    )
    .catch(err => {
        res.status(400).json({ message: err.message});
    })
};

// login user
exports.loginUser = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({email: email})
    .then(user => {
        
        // check if the user exists
        if (user) {
            user.comparePassword(password)
            .then(result => {
                // user has been authenticated
                if(result) {
                    // add login logic here
                    const token = createToken(user._id);
                    res.status(201).json({message: "Successfully log in", token});
                } else {
                    res.json({ message: "Incorrect credentials" });
                }
            })
        } else {
            res.json({ message: "User not found" });
        }

    })
    .catch(err => console.log(err.message));
};

exports.profile = async (req, res) => {

    if (!req.user || !req.user.id) {
        console.log("User ID not found in request");
        return res.status(400).json({ message: "User not found" });
    }
    const userId = req.user.id;
    const { _id, name, email, defaultLocation, createdAt, savedLocations,  } = await User.findById(userId).populate('savedLocations');
    let date = DateTime.fromISO((createdAt).toISOString().substring(0, 23)).toFormat("MMMM d, yyyy");
    res.json({ 
        _id, 
        name, 
        email, 
        date,
        defaultLocation, 
        savedLocations, 
    });

}

// logout user
exports.logout =  async (req, res) => {
    // add logout logic here
    res.json({ message: "User logged out" });
}