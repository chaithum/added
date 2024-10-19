const FoodItem = require('../model/FoodItem');
const Restaurant = require('../model/Restaurant');

// Add a food item
const addFoodItem = async (req, res) => {
    const { restaurant, name, price, description, image } = req.body;

    try {
        const foodItem = new FoodItem({
            restaurant,
            name,
            price,
            description,
            image,
        });

        await foodItem.save();
        return res.status(201).json({ message: 'Food item added successfully', foodItem });
    } catch (err) {
        return res.status(500).json({ message: 'Error adding food item', error: err.message });
    }
};

// Get all food items
const getFoodItems = async (req, res) => {
    try {
        const foodItems = await FoodItem.find().populate('restaurant');
        return res.status(200).json({ foodItems });
    } catch (err) {
        return res.status(500).json({ message: 'Error fetching food items', error: err.message });
    }
};

// Get a food item by ID
const getFoodItemById = async (req, res) => {
    const { id } = req.params;

    try {
        const foodItem = await FoodItem.findById(id).populate('restaurant');
        if (!foodItem) {
            return res.status(404).json({ message: 'Food item not found' });
        }
        return res.status(200).json({ foodItem });
    } catch (err) {
        return res.status(500).json({ message: 'Error fetching food item', error: err.message });
    }
};

// Update a food item
const updateFoodItem = async (req, res) => {
    const { id } = req.params;
    const { name, price, description, image, available } = req.body;

    try {
        const foodItem = await FoodItem.findByIdAndUpdate(id, { name, price, description, image, available }, { new: true });
        if (!foodItem) {
            return res.status(404).json({ message: 'Food item not found' });
        }
        return res.status(200).json({ message: 'Food item updated successfully', foodItem });
    } catch (err) {
        return res.status(500).json({ message: 'Error updating food item', error: err.message });
    }
};

// Delete a food item
const deleteFoodItem = async (req, res) => {
    const { id } = req.params;

    try {
        const foodItem = await FoodItem.findByIdAndDelete(id);
        if (!foodItem) {
            return res.status(404).json({ message: 'Food item not found' });
        }
        return res.status(200).json({ message: 'Food item deleted successfully' });
    } catch (err) {
        return res.status(500).json({ message: 'Error deleting food item', error: err.message });
    }
};

module.exports = {
    addFoodItem,
    getFoodItems,
    getFoodItemById,
    updateFoodItem,
    deleteFoodItem,
};
