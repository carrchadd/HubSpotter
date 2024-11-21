const User = require("../models/userModel");
const jwt = require('jsonwebtoken');

const createToken = () => {
    return jwt.sign({ id: this._id }, process.env.SECRET, { expiresIn: 60 * 60 * 24 });
}

// login user
exports.loginUser = async (req, res) => {
    const username = req.body.userName;
    const password = req.body.password;
    console.log(username);
    User.findOne({userName: username})
    .then(user => {
        
        // check if the user exists
        if (user) {
            user.comparePassword(password)
            .then(result => {
                // user has been authenticated
                if(result) {
                    // add login logic here
                    const token = createToken(user._id);
                    console.log("user successfully logged in");
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

// signup user
exports.signupUser = async (req, res) => {
    const user = new User(req.body);
    user.save()
    .then ((savedUser) => {
        console.log(savedUser._id);
        // create the token
        const token = createToken(savedUser._id);
        res.status(201).json({message: "User successfully created", token});
    }
    )
    .catch(err => {
        res.status(400).json({ message: err.message});
    })
};


// logout user
exports.logout =  async (req, res) => {
    // add logout logic here
    res.json({ message: "User logged out" });
}