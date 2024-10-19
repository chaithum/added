import React from "react";
import { useSelector, useDispatch } from "react-redux"; // Import useSelector and useDispatch
import { useNavigate } from "react-router-dom";
import { authActions } from "../store"; // Adjust this based on your store structure
import {
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
  MDBCardText,
  MDBBtn,
  MDBRow,
  MDBCol,
} from "mdb-react-ui-kit";

const HomePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch(); // Initialize dispatch
  const restaurantName = useSelector((state) => state.restaurant.name); // Adjust based on your state structure

  const handleAddItem = () => {
    navigate("/add-item");
  };

  const handleDisplayItems = () => {
    navigate("/items");
  };

  const handleUpdateRestaurant = () => {
    navigate("/update-restaurant");
  };

  const handleLogout = () => {
    localStorage.removeItem("adminId"); // Clear admin ID from local storage
    dispatch(authActions.logout()); // Dispatch logout action
    navigate("/login"); // Redirect to login page
  };

  return (
    <MDBContainer className="mt-5">
      <MDBCard>
        <MDBCardBody>
          <MDBCardTitle className="text-center">
            Welcome to {restaurantName}!
          </MDBCardTitle>
          <MDBCardText className="text-center">
            Experience the best dining experience with us. Explore our menu, add new items, and manage your restaurant details effortlessly.
          </MDBCardText>
          <MDBRow className="mt-4">
            <MDBCol md="4">
              <MDBBtn color="primary" onClick={handleAddItem} block>
                Add Item
              </MDBBtn>
            </MDBCol>
            <MDBCol md="4">
              <MDBBtn color="success" onClick={handleDisplayItems} block>
                Display Items
              </MDBBtn>
            </MDBCol>
            <MDBCol md="4">
              <MDBBtn color="warning" onClick={handleUpdateRestaurant} block>
                Update Restaurant Details
              </MDBBtn>
            </MDBCol>
          </MDBRow>
          <MDBRow className="mt-4">
            <MDBCol md="12">
              <MDBBtn color="danger" onClick={handleLogout} block>
                Logout
              </MDBBtn>
            </MDBCol>
          </MDBRow>
        </MDBCardBody>
      </MDBCard>
    </MDBContainer>
  );
};

export default HomePage;
