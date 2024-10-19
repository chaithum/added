const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
    items: [{ 
        foodItem: { type: mongoose.Schema.Types.ObjectId, ref: 'FoodItem' }, 
        quantity: { type: Number, required: true }
    }],
    totalPrice: { type: Number, required: true },
    deliveryAddress: { type: String, required: true },
    deliveryDistance: { type: Number },
    deliveryCharges: { type: Number, default: 0 },
    status: { type: String, default: 'Placed' },
    orderDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Order', orderSchema);
