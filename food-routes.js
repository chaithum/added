import UpdateItem from "./components/UpdateItem"; // Import UpdateItem component

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/add-item" element={<AddItem />} />
        <Route path="/restaurant/:id" element={<RestaurantMenu />} /> {/* Restaurant menu page */}
        <Route path="/update-item/:itemId" element={<UpdateItem />} /> {/* Update item page */}
        <Route path="/update-profile" element={<UpdateProfile />} />
      </Routes>
    </Router>
  );
}
const express = require("express");
const multer = require("multer");
const router = express.Router();
const Item = require("../models/Item"); // Your item model

// Set up multer for storing images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Specify the uploads folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // Create unique filenames
  },
});

const upload = multer({ storage: storage });

// Route for adding a new item with image upload
router.post("/items", upload.single("image"), async (req, res) => {
  const { name, description, price } = req.body;
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : ""; // Path to the uploaded image

  try {
    const newItem = new Item({
      name,
      description,
      price,
      imageUrl,
    });

    await newItem.save();
    res.status(201).json({ message: "Item added successfully", newItem });
  } catch (err) {
    res.status(500).json({ message: "Error adding item", error: err.message });
  }
});

module.exports = router;


const express = require("express");
const path = require("path");

const app = express();

// Serve static files from the uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Other middleware and routes
