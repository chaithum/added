const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
         type: String, 
         required: true
         },
    email: { 
        type: String, 
        required: true, 
        unique: true
     },
    password: { 
        type: String, 
        required: true },
    address: { 
        type: String, 
        required: true 
    },
    phone: { 
        type: String 
    },
    orders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }],
    rating: { type: Number, default: 0 },
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
});

module.exports = mongoose.model('User', userSchema);
