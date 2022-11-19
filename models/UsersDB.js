const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, min: 8, max: 16 },
    password: { type: String, required: true, min: 3, max: 16 },
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true },
    Bio: { type: String, required: false },
});

const user = mongoose.model("users", UserSchema);

module.exports = user;