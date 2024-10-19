
const mongoose = require('mongoose');

const foodItemSchema = new mongoose.Schema({
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String },
    popularity: { type: Number, default: 0 },
    image: { type: String },
    available: { type: Boolean, default: true },
});

module.exports = mongoose.model('FoodItem', foodItemSchema);
