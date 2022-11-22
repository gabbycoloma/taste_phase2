const mongoose = require('mongoose');

const commentsSchema = {
    username: {
        type: String,
        required: true,
        min: 3,
        max: 16
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    comment: {
        type: String,
        required: true
    },
    posts: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'posts'
    }
};

const comment = mongoose.model("comment", commentsSchema);
module.exports = comment;