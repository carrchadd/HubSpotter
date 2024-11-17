const userModel = require("../models/userModel");

// login user
exports.loginUser = async (req, res) => {
    res.json({ message: "Login user" });
};

// signup user
exports.signupUser = async (req, res) => {
    let user = new userModel(req.body);
    user.save()
    .then ( () => {
        res.json({ message: "User signed up" });
    }
    )
    .catch(err => {
        res.status(400).json({ message: err.message});
    })
};
