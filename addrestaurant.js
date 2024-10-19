import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  MDBContainer,
  MDBInput,
  MDBBtn,
  MDBCard,
  MDBCardBody,
  MDBValidation,
  MDBValidationItem,
} from 'mdb-react-ui-kit';
import config from "../config";

const AddRestaurant = () => {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({
    restaurant_name: "",
    Area: "",
    city: "",
    sate: "",
    Zipcode: "",
    imageURL: "",
    contact_number: "",
    Description: "",
    foodItems: [],
  });
  
  const [errorMessages, setErrorMessages] = useState({}); // To store error messages

  const handleChange = (e) => {
    const { id, value } = e.target;
    setInputs((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  const validateInputs = () => {
    const errors = {};
    if (!inputs.restaurant_name) errors.restaurant_name = "Restaurant name is required.";
    if (!inputs.Area) errors.Area = "Area is required.";
    if (!inputs.city) errors.city = "City is required.";
    if (!inputs.sate) errors.sate = "State is required.";
    if (!inputs.Zipcode) errors.Zipcode = "Zipcode is required.";
    if (!inputs.imageURL) errors.imageURL = "Image URL is required.";
    if (!inputs.contact_number) errors.contact_number = "Contact number is required.";
    if (!inputs.Description) errors.Description = "Description is required.";
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateInputs();
    setErrorMessages(errors);

    // If there are errors, don't proceed
    if (Object.keys(errors).length > 0) return;

    try {
      const response = await axios.post(`${config.BASE_URL}/api/restaurants/add`, inputs);
      console.log(response.data);
      navigate("/home"); // Navigate to home page after successful addition
    } catch (error) {
      console.error("Error adding restaurant:", error);
      // You can handle errors here
    }
  };

  return (
    <MDBContainer className="mt-5">
      <MDBCard>
        <MDBCardBody>
          <h3 className="text-center mb-4">Add Restaurant</h3>
          <MDBValidation onSubmit={handleSubmit}>
            {/* Restaurant Name */}
            <MDBValidationItem feedback={errorMessages.restaurant_name} invalid>
              <MDBInput
                onChange={handleChange}
                label="Restaurant Name"
                id="restaurant_name"
                type="text"
                required
              />
            </MDBValidationItem>

            {/* Area */}
            <MDBValidationItem feedback={errorMessages.Area} invalid>
              <MDBInput
                onChange={handleChange}
                label="Area"
                id="Area"
                type="text"
                required
              />
            </MDBValidationItem>

            {/* City */}
            <MDBValidationItem feedback={errorMessages.city} invalid>
              <MDBInput
                onChange={handleChange}
                label="City"
                id="city"
                type="text"
                required
              />
            </MDBValidationItem>

            {/* State */}
            <MDBValidationItem feedback={errorMessages.sate} invalid>
              <MDBInput
                onChange={handleChange}
                label="State"
                id="sate"
                type="text"
                required
              />
            </MDBValidationItem>

            {/* Zipcode */}
            <MDBValidationItem feedback={errorMessages.Zipcode} invalid>
              <MDBInput
                onChange={handleChange}
                label="Zipcode"
                id="Zipcode"
                type="text"
                required
              />
            </MDBValidationItem>

            {/* Image URL */}
            <MDBValidationItem feedback={errorMessages.imageURL} invalid>
              <MDBInput
                onChange={handleChange}
                label="Image URL"
                id="imageURL"
                type="text"
                required
              />
            </MDBValidationItem>

            {/* Contact Number */}
            <MDBValidationItem feedback={errorMessages.contact_number} invalid>
              <MDBInput
                onChange={handleChange}
                label="Contact Number"
                id="contact_number"
                type="text"
                required
              />
            </MDBValidationItem>

            {/* Description */}
            <MDBValidationItem feedback={errorMessages.Description} invalid>
              <MDBInput
                onChange={handleChange}
                label="Description"
                id="Description"
                type="textarea"
                required
              />
            </MDBValidationItem>

            {/* Food Items (Optional Field) */}
            <MDBInput
              onChange={handleChange}
              label="Food Items (comma separated)"
              id="foodItems"
              type="text"
              onBlur={(e) => setInputs({...inputs, foodItems: e.target.value.split(",").map(item => item.trim())})} // Convert to array
            />

            {/* Submit Button */}
            <MDBBtn color="primary" type="submit" block>
              Add Restaurant
            </MDBBtn>
          </MDBValidation>
        </MDBCardBody>
      </MDBCard>
    </MDBContainer>
  );
};

export default AddRestaurant;
