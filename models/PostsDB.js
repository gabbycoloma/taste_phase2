const mongoose = require('mongoose');


const postsSchema = {
    username: {
        type: String,
        ref: 'users',
        required: true,
        min: 8,
        max: 16
    },
    user_image: {
        type: String
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    image_post: {
        type: String,
        required: true
    },
    food_name: {
        type: String,
        min: 1,
        max: 50,
        required: true
    },
    restaurant_name: {
        type: String,
        min: 2,
        max: 50,
        required: true
    },
    rating: {
        type: Number,
        required: true
    },
    review: {
        type: String,
        min: 1,
        required: true
    },
    likeCount: {
        type: Number,
        required: false,
        default: 0
    },
    likes: {
        type: []
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'comments'
    }]

};

const posts = mongoose.model("posts", postsSchema);
module.exports = posts;