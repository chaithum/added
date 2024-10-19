import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
  MDBCardText,
  MDBRow,
  MDBCol,
  MDBBtn,
  MDBAlert,
} from "mdb-react-ui-kit";
import config from "../config";

const DisplayRestaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await axios.get(`${config.BASE_URL}/api/restaurants`);
        setRestaurants(response.data.restaurants);
      } catch (err) {
        setError("Failed to fetch restaurants.");
      }
    };
    fetchRestaurants();
  }, []);

  const handleUpdate = (restaurantId) => {
    navigate(`/update-restaurant/${restaurantId}`);
  };

  const handleDelete = async (restaurantId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this restaurant?");
    if (!confirmDelete) return; // Exit if the user cancels

    try {
      await axios.delete(`${config.BASE_URL}/api/restaurants/${restaurantId}`);
      setRestaurants((prev) => prev.filter((restaurant) => restaurant._id !== restaurantId));
    } catch (err) {
      setError("Failed to delete restaurant.");
    }
  };

  return (
    <MDBContainer className="mt-5">
      {error && <MDBAlert color="danger">{error}</MDBAlert>}
      <MDBRow>
        {restaurants.map((restaurant) => (
          <MDBCol md="4" key={restaurant._id} className="mb-4">
            <MDBCard>
              <img
                src={restaurant.image} // Assuming restaurant has an image field
                alt={restaurant.name}
                className="img-fluid"
                style={{ height: "200px", objectFit: "cover" }}
              />
              <MDBCardBody>
                <MDBCardTitle>{restaurant.name}</MDBCardTitle>
                <MDBCardText>{restaurant.description}</MDBCardText>
                <MDBBtn color="warning" onClick={() => handleUpdate(restaurant._id)}>
                  Update
                </MDBBtn>
                <MDBBtn color="danger" onClick={() => handleDelete(restaurant._id)}>
                  Delete
                </MDBBtn>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        ))}
      </MDBRow>
    </MDBContainer>
  );
};

export default DisplayRestaurants;
