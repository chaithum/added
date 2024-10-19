const mongoose = require('mongoose');
const Restaurants = require('../model/Restaurant');

// Get all restaurants
const getAllRestaurants = async (req, res, next) => {
    let restaurantsList;
    try {
        restaurantsList = await Restaurants.find();
    } catch (e) {
        console.log(e);
        return res.status(500).json({ message: "Fetching restaurants failed" });
    }

    if (!restaurantsList || restaurantsList.length === 0) {
        return res.status(404).json({ message: "No restaurants found" });
    }

    return res.status(200).json({ restaurants: restaurantsList });
};

// Add a restaurant
const addRestaurants = async (req, res, next) => {
    const { restid, restaurant_name, imageURL, Area, Zipcode, sate, city, contact_number, Description } = req.body;

    if (!restid) {
        return res.status(400).json({ message: "Restaurant ID is required" });
    }

    let existingRestaurants;
    try {
        existingRestaurants = await Restaurants.findOne({ restid });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ message: "Error checking existing restaurant" });
    }

    if (existingRestaurants) {
        return res.status(400).json({ message: "The Restaurant already exists" });
    }

    const restaurant = new Restaurants({
        restid,
        restaurant_name,
        imageURL,
        Area,
        Zipcode,
        sate,
        city,
        contact_number,
        Description,
    });

    try {
        await restaurant.save();
        return res.status(201).json({ restaurant });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error saving restaurant', error: err });
    }
};

// Update a restaurant
const updateRestaurant = async (req, res, next) => {
    const { restid, restaurant_name, imageURL, Area, Zipcode, sate, city, contact_number, Description } = req.body;

    try {
        const existingRestaurant = await Restaurants.findOne({ restid });
        if (!existingRestaurant) {
            return res.status(404).json({ message: "Restaurant not found" });
        }

        const result = await Restaurants.updateOne(
            { restid },
            { $set: { restaurant_name, imageURL, Area, Zipcode, sate, city, contact_number, Description } }
        );

        if (result.nModified === 0) {
            return res.status(400).json({ message: "No changes made" });
        }
        return res.status(200).json({ message: "Restaurant updated successfully" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Error updating restaurant", error: err });
    }
};

// Get a restaurant by ID
const getRestaurantById = async (req, res, next) => {
    const { restid } = req.params;

    try {
        const restaurant = await Restaurants.findOne({ restid });
        if (!restaurant) {
            return res.status(404).json({ message: "Restaurant not found" });
        }
        return res.status(200).json({ restaurant });
    } catch (err) {
        return res.status(500).json({ message: "Error querying restaurant", error: err });
    }
};

// Get restaurant by city
const getRestaurantByCity = async (req, res, next) => {
    const { city } = req.params;

    try {
        const restaurant = await Restaurants.find({ city });
        if (restaurant.length === 0) {
            return res.status(404).json({ message: "No restaurants found in this city" });
        }
        return res.status(200).json({ restaurant });
    } catch (err) {
        return res.status(500).json({ message: "Error querying restaurant", error: err });
    }
};

// Get restaurant by Zip code
const getRestaurantByZipCode = async (req, res, next) => {
    const { Zipcode } = req.params;

    try {
        const restaurant = await Restaurants.find({ Zipcode });
        if (restaurant.length === 0) {
            return res.status(404).json({ message: "No restaurants found for this Zip code" });
        }
        return res.status(200).json({ restaurant });
    } catch (err) {
        return res.status(500).json({ message: "Error querying restaurant", error: err });
    }
};

// Get restaurant by name
const getRestaurantByName = async (req, res, next) => {
    const { restaurant_name } = req.params;

    try {
        const restaurant = await Restaurants.find({
            restaurant_name: { $regex: new RegExp(restaurant_name, 'i') }
        });
        if (restaurant.length === 0) {
            return res.status(404).json({ message: "No restaurants found with this name" });
        }
        return res.status(200).json({ restaurant });
    } catch (err) {
        return res.status(500).json({ message: "Error querying restaurant", error: err });
    }
};

// Get restaurant by state
const getRestaurantByState = async (req, res, next) => {
    const { sate } = req.params;

    try {
        const restaurant = await Restaurants.find({
            sate: { $regex: new RegExp(sate, 'i') }
        });
        if (restaurant.length === 0) {
            return res.status(404).json({ message: "No restaurants found in this state" });
        }
        return res.status(200).json({ restaurant });
    } catch (err) {
        return res.status(500).json({ message: "Error querying restaurant", error: err });
    }
};

// Get restaurant by area
const getRestaurantByArea = async (req, res, next) => {
    const { Area } = req.params;

    try {
        const restaurant = await Restaurants.find({
            Area: { $regex: new RegExp(Area, 'i') }
        });
        if (restaurant.length === 0) {
            return res.status(404).json({ message: "No restaurants found in this area" });
        }
        return res.status(200).json({ restaurant });
    } catch (err) {
        return res.status(500).json({ message: "Error querying restaurant", error: err });
    }
};

// Delete a restaurant
const deleteRestaurant = async (req, res, next) => {
    const { restid } = req.params;
    try {
        const deletedRestaurant = await Restaurants.findOneAndDelete({ restid });
        if (!deletedRestaurant) {
            return res.status(404).json({ message: "Restaurant not found" });
        }
        return res.status(200).json({ message: "Restaurant deleted successfully", restaurant: deletedRestaurant });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Error deleting restaurant", error: err });
    }
};

// Export all controller functions
module.exports = {
    getAllRestaurants,
    addRestaurants,
    getRestaurantById,
    deleteRestaurant,
    getRestaurantByCity,
    getRestaurantByZipCode,
    getRestaurantByName,
    getRestaurantByArea,
    getRestaurantByState,
    updateRestaurant,
};
