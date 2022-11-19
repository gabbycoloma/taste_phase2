const mongoose = require('mongoose');


const postsSchema = {
    username: { type: String, required: true, min: 8, max: 16 },
    date: { type: Date, required: true },
    image_post: { type: String, required: false },
    food_name: { type: String, min: 3, max: 50, required: true },
    restaurant_name: { type: String, min: 3, max: 50, required: true },
    stars: { type: Number, required: true },
    review: { type: String, min: 1, required: true },
    likes: { type: Number, required: false },
};

const posts = mongoose.model("posts", postsSchema);
module.exports = posts;