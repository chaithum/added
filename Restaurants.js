const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const RestaurantSchema = new Schema({

   restid:{
        type: Number,
        ref:"Restaurant",
        unique:true,
        required:true
    },
    restaurant_name: {
      type: String,
        required: true
    },
    Area: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    sate: {
        type: String,
        required: true,
    },
    Zipcode: {
        type: String,
        required: true,
    },
    imageURL: {
        type: String,
        required: true,
    },
    contact_number: {
        type: String,
        required: true,
        // minlength: 10
    },
    Description:{
        type: String,
        required: true,
        },
    date: {
        type: Date,
        default: Date.now
    },
    foodItems: [{ type: mongoose.Schema.Types.ObjectId, ref: 'FoodItem' }]
})

module.exports = mongoose.model("Restaurant", RestaurantSchema);



