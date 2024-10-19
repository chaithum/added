const mongoose = require('mongoose');
const Admin = require('../model/Admin');
const bcrypt = require('bcryptjs');

// Sign Up
const adminsignUp = async (req, res, next) => {
    const { username, email, password} = req.body; // Use username instead of full_name
    // if (password !== confirm_password) {
    //     return res.status(400).json({ error: 'Passwords do not match' });
    // }

    let existingUser;
    try {
        existingUser = await Admin.findOne({ email });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'Error checking existing user' });
    }
    
    if (existingUser) {
        return res.status(400).json({ message: "User already exists!" });
    }

    const hashedPassword = bcrypt.hashSync(password);

    const admin = new Admin({
        username,
        email,
        password: hashedPassword,
    });

    try {
        await admin.save();
        return res.status(201).json({ message: 'Admin created successfully', admin });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'Error saving admin' });
    }
};

// Log In
const adminlogIn = async (req, res, next) => {
    const { email, password } = req.body;

    let existingUser;
    try {
        existingUser = await Admin.findOne({ email });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'Error finding user' });
    }
    
    if (!existingUser) {
        return res.status(404).json({ message: "User not found" });
    }

    const isPasswordCorrect = bcrypt.compareSync(password, existingUser.password);
    if (!isPasswordCorrect) {
        return res.status(400).json({ message: "Incorrect Password!" });
    }

    return res.status(200).json({ message: 'Login successful', admin: existingUser });
};

// Forgot Password
const adminforgotpassword = async (req, res, next) => {
    const { email, password} = req.body;
    // if (password !== confirm_password) {
    //     return res.status(400).json({ error: 'Passwords do not match' });
    // }

    let existingUser;
    try {
        existingUser = await Admin.findOne({ email });
    } catch (err) {
        return res.status(500).json({ message: 'Error finding user' });
    }
    
    if (!existingUser) {
        return res.status(404).json({ message: 'User not found' });
    }

    const hashedPassword = bcrypt.hashSync(password);
    existingUser.password = hashedPassword; // Update only the password

    try {
        await existingUser.save();
        return res.status(200).json({ message: 'Password updated successfully' });
    } catch (err) {
        return res.status(500).json({ message: 'Error updating password' });
    }
};

// Export the controller functions
module.exports = { adminsignUp, adminlogIn, adminforgotpassword };








// const Admin = require('../model/Admin');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const Restaurant = require('../model/Restaurant');
// const User = require('../model/User');
// const Order = require('../model/Order');
// const Review = require('../model/Review');

// const adminsignUp = async (req, res) => {
//     const { username, email, password, confirm_password } = req.body;

//     // Check if passwords match
//     if (password !== confirm_password) {
//         return res.status(400).json({ message: 'Passwords do not match' });
//     }

//     let existingAdmin;
//     try {
//         existingAdmin = await Admin.findOne({ email });
//     } catch (err) {
//         return res.status(500).json({ message: 'Error checking existing admin' });
//     }

//     if (existingAdmin) {
//         return res.status(400).json({ message: 'Admin already exists with this email' });
//     }

//     // Hash the password
//     const hashedPassword = bcrypt.hashSync(password, 10);

//     const newAdmin = new Admin({
//         username,
//         email,
//         password: hashedPassword,
//     });

//     try {
//         await newAdmin.save();
//         return res.status(201).json({ message: 'Admin created successfully', admin: newAdmin });
//     } catch (err) {
//         return res.status(500).json({ message: 'Error creating admin' });
//     }
// };

// // Admin login
// const adminLogin = async (req, res) => {
//     const { email, password } = req.body;

//     let existingAdmin;
//     try {
//         existingAdmin = await Admin.findOne({ email });
//     } catch (err) {
//         return res.status(500).json({ message: 'Error logging in' });
//     }

//     if (!existingAdmin) {
//         return res.status(404).json({ message: 'Admin not found' });
//     }

//     const isPasswordCorrect = bcrypt.compareSync(password, existingAdmin.password);
//     if (!isPasswordCorrect) {
//         return res.status(400).json({ message: 'Incorrect password' });
//     }

//     // Generate JWT token
//     const token = jwt.sign({ id: existingAdmin._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
//     return res.status(200).json({ message: 'Login successful', token });
// };
// // Forgot password
// const adminforgotPassword = async (req, res) => {
//     const { email, newPassword } = req.body;

//     let existingUser;
//     try {
//         existingUser = await Admin.findOne({ email });
//     } catch (err) {
//         return res.status(500).json({ message: 'Error finding user' });
//     }

//     if (!existingUser) {
//         return res.status(404).json({ message: 'User not found' });
//     }

//     // Hash the new password
//     const hashedPassword = bcrypt.hashSync(newPassword, 10);

//     try {
//         existingUser.password = hashedPassword; // Update the password
//         await existingUser.save(); // Save the changes
//         return res.status(200).json({ message: 'Password updated successfully' });
//     } catch (err) {
//         return res.status(500).json({ message: 'Error updating password' });
//     }
// };

// // Add restaurant
// const addRestaurant = async (req, res) => {
//     const { restaurant_name, Area, city, sate, Zipcode, imageURL, contact_number, Description, foodItems } = req.body;

//     // Generate a random 3-digit number for restid
//     const restid = Math.floor(100 + Math.random() * 900); // Generates a number between 100 and 999

//     const restaurant = new Restaurant({
//         restid,
//         restaurant_name,
//         Area,
//         city,
//         sate,
//         Zipcode,
//         imageURL,
//         contact_number,
//         Description,
//         foodItems,
//     });

//     try {
//         await restaurant.save();
//         return res.status(201).json({ message: 'Restaurant added successfully', restaurant });
//     } catch (err) {
//         return res.status(500).json({ message: 'Error adding restaurant', error: err.message });
//     }
// };


// // View all restaurants
// const getRestaurants = async (req, res) => {
//     try {
//         const restaurants = await Restaurant.find().populate('foodItems'); // Populate foodItems if needed
//         return res.status(200).json({ restaurants });
//     } catch (err) {
//         return res.status(500).json({ message: 'Error fetching restaurants', error: err.message });
//     }
// };

// // Update restaurant
// const updateRestaurant = async (req, res) => {
//     const { restid } = req.params; // Assuming restid is passed as a URL parameter
//     const { restaurant_name, Area, city, sate, Zipcode, imageURL, contact_number, Description, foodItems } = req.body;

//     try {
//         const restaurant = await Restaurant.findOneAndUpdate(
//             { restid }, // Find restaurant by restid
//             { restaurant_name, Area, city, sate, Zipcode, imageURL, contact_number, Description, foodItems },
//             { new: true, runValidators: true } // Ensures validators are run during update
//         );

//         if (!restaurant) {
//             return res.status(404).json({ message: 'Restaurant not found' });
//         }
//         return res.status(200).json({ message: 'Restaurant updated successfully', restaurant });
//     } catch (err) {
//         return res.status(500).json({ message: 'Error updating restaurant', error: err.message });
//     }
// };

// // const updateRestaurant = async (req, res) => {
// //     const { id } = req.params;
// //     const { name, description, image } = req.body;
  
// //     try {
// //       const restaurant = await Restaurant.findByIdAndUpdate(id, { name, description, image }, { new: true });
// //       return res.status(200).json({ restaurant });
// //     } catch (err) {
// //       return res.status(500).json({ message: 'Error updating restaurant', error: err.message });
// //     }
// //   };
  
// // Delete restaurant
// const deleteRestaurant = async (req, res) => {
//     const { id } = req.params;

//     try {
//         const restaurant = await Restaurant.findByIdAndDelete(id);
//         if (!restaurant) {
//             return res.status(404).json({ message: 'Restaurant not found' });
//         }
//         return res.status(200).json({ message: 'Restaurant deleted successfully' });
//     } catch (err) {
//         return res.status(500).json({ message: 'Error deleting restaurant', error: err.message });
//     }
// };


// // Add user
// const addUser = async (req, res) => {
//     const { name, email, password, address } = req.body;

//     let existingUser;
//     try {
//         existingUser = await User.findOne({ email });
//     } catch (err) {
//         return res.status(500).json({ message: 'Error checking user existence' });
//     }

//     if (existingUser) {
//         return res.status(400).json({ message: 'User already exists' });
//     }

//     const hashedPassword = bcrypt.hashSync(password, 10);

//     const newUser = new User({
//         name,
//         email,
//         password: hashedPassword,
//         address,
//     });

//     try {
//         await newUser.save();
//         return res.status(201).json({ message: 'User added successfully', newUser });
//     } catch (err) {
//         return res.status(500).json({ message: 'Error adding user' });
//     }
// };

// // View all users
// const getUsers = async (req, res) => {
//     try {
//         const users = await User.find().populate('orders reviews');
//         return res.status(200).json({ users });
//     } catch (err) {
//         return res.status(500).json({ message: 'Error fetching users' });
//     }
// };

// // Update user
// const updateUser = async (req, res) => {
//     const { id } = req.params;
//     const { name, email, address } = req.body;

//     try {
//         const user = await User.findByIdAndUpdate(id, { name, email, address }, { new: true });
//         if (!user) {
//             return res.status(404).json({ message: 'User not found' });
//         }
//         return res.status(200).json({ message: 'User updated successfully', user });
//     } catch (err) {
//         return res.status(500).json({ message: 'Error updating user' });
//     }
// };

// // Delete user
// const deleteUser = async (req, res) => {
//     const { id } = req.params;

//     try {
//         const user = await User.findByIdAndDelete(id);
//         if (!user) {
//             return res.status(404).json({ message: 'User not found' });
//         }
//         return res.status(200).json({ message: 'User deleted successfully' });
//     } catch (err) {
//         return res.status(500).json({ message: 'Error deleting user' });
//     }
// };

// // View orders placed by a user
// const getOrdersByUser = async (req, res) => {
//     const { userId } = req.params;

//     try {
//         const orders = await Order.find({ user: userId }).populate('restaurant items.foodItem');
//         if (!orders.length) {
//             return res.status(404).json({ message: 'No orders found for this user' });
//         }
//         return res.status(200).json({ orders });
//     } catch (err) {
//         return res.status(500).json({ message: 'Error fetching orders' });
//     }
// };

// // Manage user ratings
// const manageUserRatings = async (req, res) => {
//     const { userId } = req.params;
//     const { rating } = req.body;

//     try {
//         const user = await User.findById(userId);
//         if (!user) {
//             return res.status(404).json({ message: 'User not found' });
//         }

//         user.rating = rating;
//         await user.save();

//         return res.status(200).json({ message: 'User rating updated successfully', user });
//     } catch (err) {
//         return res.status(500).json({ message: 'Error updating user rating' });
//     }
// };

// module.exports = {
//     adminsignUp,
//     adminLogin,
//     addRestaurant,
//     getRestaurants,
//     updateRestaurant,
//     deleteRestaurant,
//     addUser,
//     getUsers,
//     updateUser,
//     deleteUser,
//     getOrdersByUser,
//     manageUserRatings,
//     adminforgotPassword
// };
