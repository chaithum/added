const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    foodItem: { type: mongoose.Schema.Types.ObjectId, ref: 'FoodItem', required: true },
    rating: { type: Number, required: true }, // 1 to 5 stars
    comment: { type: String },
    likes: { type: Number, default: 0 },
    date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Review', reviewSchema);
