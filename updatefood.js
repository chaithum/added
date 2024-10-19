router.put("/items/:id", upload.single("image"), async (req, res) => {
    const { name, description, price } = req.body;
    let updatedItem = {
      name,
      description,
      price,
    };
  
    // Check if there's a new image file and update the imageUrl
    if (req.file) {
      updatedItem.imageUrl = `/uploads/${req.file.filename}`;
    }
  
    try {
      const item = await Item.findByIdAndUpdate(req.params.id, updatedItem, { new: true });
      res.status(200).json(item);
    } catch (err) {
      res.status(500).json({ message: "Error updating item", error: err.message });
    }
  });

  



  import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import config from "../config"; // Your config file for API base URL
import { MDBContainer, MDBInput, MDBBtn, MDBCard, MDBCardBody, MDBAlert } from "mdb-react-ui-kit";

const UpdateItem = () => {
  const { itemId } = useParams(); // Get item ID from URL
  const navigate = useNavigate();

  const [itemDetails, setItemDetails] = useState({
    name: "",
    description: "",
    price: 0,
  });
  const [imageFile, setImageFile] = useState(null); // To store the selected image file
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState("");

  // Fetch item details
  const fetchItemDetails = async () => {
    try {
      const response = await axios.get(`${config.BASE_URL}/api/items/${itemId}`);
      setItemDetails(response.data); // Set item details from the server
    } catch (err) {
      setError("Error fetching item details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItemDetails();
  }, [itemId]);

  // Handle input changes
  const handleChange = (e) => {
    const { id, value } = e.target;
    setItemDetails((prev) => ({ ...prev, [id]: value }));
  };

  // Handle file input change
  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]); // Store the selected file
  };

  // Show error or success messages
  const showMessage = (message, isError = false) => {
    if (isError) {
      setError(message);
      setSuccess("");
    } else {
      setSuccess(message);
      setError("");
    }
    setTimeout(() => {
      setError("");
      setSuccess("");
    }, 3000); // Clear messages after 3 seconds
  };

  // Handle form submission for updating item
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate fields
    if (!itemDetails.name || !itemDetails.description || !itemDetails.price) {
      showMessage("All fields are required.", true);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", itemDetails.name);
      formData.append("description", itemDetails.description);
      formData.append("price", itemDetails.price);
      if (imageFile) formData.append("image", imageFile); // Append image only if selected

      // Send request to update the item
      await axios.put(`${config.BASE_URL}/api/items/${itemId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      showMessage("Item updated successfully!");
      setTimeout(() => {
        navigate(`/restaurant/${itemDetails.restaurantId}`); // Redirect to restaurant menu
      }, 1000);
    } catch (err) {
      showMessage("Error updating item. Please try again.", true);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <MDBAlert color="danger">{error}</MDBAlert>;

  return (
    <MDBContainer className="mt-5">
      <MDBCard>
        <MDBCardBody>
          <h3>Update Item</h3>
          
          {/* Display success or error message */}
          {error && <MDBAlert color="danger">{error}</MDBAlert>}
          {success && <MDBAlert color="success">{success}</MDBAlert>}

          <form onSubmit={handleSubmit}>
            {/* Name Input */}
            <MDBInput
              id="name"
              label="Item Name"
              value={itemDetails.name}
              onChange={handleChange}
              required
            />

            {/* Description Input */}
            <MDBInput
              id="description"
              label="Description"
              value={itemDetails.description}
              onChange={handleChange}
              required
            />

            {/* Price Input */}
            <MDBInput
              id="price"
              label="Price"
              type="number"
              value={itemDetails.price}
              onChange={handleChange}
              required
            />

            {/* Image Input */}
            <div className="mb-4">
              <label>Upload New Image</label>
              <input
                type="file"
                onChange={handleFileChange}
              />
            </div>

            <MDBBtn type="submit" color="primary" block>
              Update Item
            </MDBBtn>
          </form>
        </MDBCardBody>
      </MDBCard>
    </MDBContainer>
  );
};

export default UpdateItem;
