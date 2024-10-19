import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import config from "../config"; // Your config file for API base URL
import {
  MDBContainer,
  MDBInput,
  MDBBtn,
  MDBCard,
  MDBCardBody,
  MDBAlert,
} from "mdb-react-ui-kit";

const AddItem = () => {
  const [inputs, setInputs] = useState({
    name: "",
    description: "",
    price: "",
  });
  const [imageFile, setImageFile] = useState(null); // To store selected file
  const [error, setError] = useState(""); 
  const [success, setSuccess] = useState(""); 
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setInputs((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]); // Get the selected file
  };

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
    }, 3000);
  };

  const sendRequest = async (formData) => {
    try {
      const res = await axios.post(`${config.BASE_URL}/api/items`, formData, {
        headers: { "Content-Type": "multipart/form-data" }, // Set the correct content type
      });
      return res.data;
    } catch (err) {
      console.error(err);
      showMessage("Error adding item. Please try again.", true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!inputs.name || !inputs.description || !inputs.price || !imageFile) {
      showMessage("All fields are required.", true);
      return;
    }

    // Create form data to send file and other inputs
    const formData = new FormData();
    formData.append("name", inputs.name);
    formData.append("description", inputs.description);
    formData.append("price", inputs.price);
    formData.append("image", imageFile); // Add image file to form data

    const data = await sendRequest(formData);
    if (data) {
      showMessage("Item added successfully!");
      setInputs({
        name: "",
        description: "",
        price: "",
      });
      setImageFile(null); // Reset file input
    }
  };

  return (
    <MDBContainer className="mt-5 d-flex justify-content-center">
      <MDBCard style={{ maxWidth: "500px", width: "100%" }}>
        <MDBCardBody>
          <h3 className="text-center mb-4">Add Food Item</h3>

          {error && (
            <MDBAlert color="danger" className="text-center">
              {error}
            </MDBAlert>
          )}
          {success && (
            <MDBAlert color="success" className="text-center">
              {success}
            </MDBAlert>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label>Name</label>
              <MDBInput
                onChange={handleChange}
                id="name"
                type="text"
                value={inputs.name}
                placeholder="Enter food item name"
                required
              />
            </div>

            <div className="mb-4">
              <label>Description</label>
              <MDBInput
                onChange={handleChange}
                id="description"
                type="text"
                value={inputs.description}
                placeholder="Enter food item description"
                required
              />
            </div>

            <div className="mb-4">
              <label>Price</label>
              <MDBInput
                onChange={handleChange}
                id="price"
                type="number"
                value={inputs.price}
                placeholder="Enter food item price"
                required
              />
            </div>

            <div className="mb-4">
              <label>Image</label>
              <input
                type="file"
                onChange={handleFileChange}
                required
              />
            </div>

            <div className="text-center">
              <MDBBtn type="submit" color="primary" block>
                Add Item
              </MDBBtn>
            </div>
          </form>
        </MDBCardBody>
      </MDBCard>
    </MDBContainer>
  );
};

export default AddItem;
