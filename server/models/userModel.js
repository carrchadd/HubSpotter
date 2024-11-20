const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const userSchema = new Schema({
    firstName: { type: String, required: [true, 'cannot be empty'] },
    username: { type: String, required: [true, 'cannot be empty'] },
    email: { type: String, required: [true, 'cannot be empty'] , unique: true},
    password: { type: String, required: [true, 'cannot be empty'] },
    savedLocations: [{ type: Schema.Types.ObjectId, ref: 'Location' }]
});

// checl if the password is modified
userSchema.pre('save', function(next) {
    let user = this;
    if(!user.isModified('password')) {
        return next(); // continue with the operation which is 'saved'
    } else {
        bcrypt.hash(user.password, 10) // hash the plain text password with salting
        .then(hash => {
            user.password = hash;
            next(); // continue with the operation
        })
        .catch(err => next(err));
    }
});

// compare the password
userSchema.methods.comparePassword = function(password) {

    return bcrypt.compare(password, this.password)

};

module.exports = mongoose.model('User', userSchema);