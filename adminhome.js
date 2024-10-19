import React from "react";
import { useNavigate } from "react-router-dom";
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

const AdminHomePage = () => {
  const navigate = useNavigate();

  const handleAddRestaurant = () => {
    navigate("/add-restaurant");
  };

  const handleDisplayRestaurants = () => {
    navigate("/display-restaurants");
  };

  const handleAddUser = () => {
    navigate("/add-user");
  };

  const handleDisplayUsers = () => {
    navigate("/display-users");
  };

  return (
    <MDBContainer className="mt-5">
      <MDBCard>
        <MDBCardBody>
          <MDBCardTitle className="text-center">Admin Dashboard</MDBCardTitle>
          <MDBCardText className="text-center">
            Manage restaurants and users efficiently. Use the options below.
          </MDBCardText>
          <MDBRow className="mt-4">
            <MDBCol md="6" className="mb-3">
              <MDBBtn color="primary" onClick={handleAddRestaurant} block>
                Add Restaurant
              </MDBBtn>
            </MDBCol>
            <MDBCol md="6" className="mb-3">
              <MDBBtn color="success" onClick={handleDisplayRestaurants} block>
                Display Restaurants
              </MDBBtn>
            </MDBCol>
            <MDBCol md="6" className="mb-3">
              <MDBBtn color="info" onClick={handleAddUser} block>
                Add User
              </MDBBtn>
            </MDBCol>
            <MDBCol md="6" className="mb-3">
              <MDBBtn color="warning" onClick={handleDisplayUsers} block>
                Display Users
              </MDBBtn>
            </MDBCol>
          </MDBRow>
        </MDBCardBody>
      </MDBCard>
    </MDBContainer>
  );
};

export default AdminHomePage;
