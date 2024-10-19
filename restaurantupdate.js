import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import {
  MDBContainer,
  MDBInput,
  MDBBtn,
  MDBCard,
  MDBCardBody,
  MDBAlert,
} from "mdb-react-ui-kit";
import config from "../config";

const UpdateRestaurant = () => {
  const { id } = useParams(); // Get the restaurant ID from the URL
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState({
    name: "",
    description: "",
    image: "",
  });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchRestaurantDetails = async () => {
      try {
        const response = await axios.get(`${config.BASE_URL}/api/restaurants/${id}`);
        setRestaurant(response.data.restaurant); // Assuming the API returns restaurant object
      } catch (err) {
        setError("Failed to fetch restaurant details.");
      }
    };
    fetchRestaurantDetails();
  }, [id]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setRestaurant((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${config.BASE_URL}/api/restaurants/${id}`, restaurant);
      setSuccessMessage("Restaurant updated successfully!");
      setTimeout(() => navigate("/display-restaurants"), 2000); // Redirect after 2 seconds
    } catch (err) {
      setError("Failed to update restaurant.");
    }
  };

  return (
    <MDBContainer className="mt-5">
      {error && <MDBAlert color="danger">{error}</MDBAlert>}
      {successMessage && <MDBAlert color="success">{successMessage}</MDBAlert>}
      <MDBCard>
        <MDBCardBody>
          <h3 className="text-center">Update Restaurant</h3>
          <form onSubmit={handleSubmit}>
            <MDBInput
              label="Restaurant Name"
              id="name"
              value={restaurant.name}
              onChange={handleChange}
              required
            />
            <MDBInput
              label="Description"
              id="description"
              value={restaurant.description}
              onChange={handleChange}
              required
            />
            <MDBInput
              label="Image URL"
              id="image"
              value={restaurant.image}
              onChange={handleChange}
              required
            />
            <MDBBtn color="primary" type="submit" block>
              Update Restaurant
            </MDBBtn>
          </form>
        </MDBCardBody>
      </MDBCard>
    </MDBContainer>
  );
};

export default UpdateRestaurant;
