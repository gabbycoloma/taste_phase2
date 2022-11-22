const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, min: 8, max: 16 },
    password: { type: String, required: true, min: 3, max: 16 },
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    Bio: { type: String, required: false },
    user_image: { type: String, required: false, default: "default.jpg" },
});

const user = mongoose.model("users", UserSchema);

module.exports = user;