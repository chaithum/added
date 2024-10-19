import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
  MDBCardText,
  MDBInput,
  MDBBtn,
  MDBSpinner,
  MDBDropdown,
  MDBDropdownToggle,
  MDBDropdownMenu,
  MDBDropdownItem,
} from "mdb-react-ui-kit";
import config from "../config"; // Your config file for API base URL
import Navbar from "./Navbar"; // Import the Navbar component

const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [previousOrders, setPreviousOrders] = useState([]);
  const [popularFoods, setPopularFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch previous orders and popular foods on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = localStorage.getItem("userId");
        
        // Fetch previous orders
        const ordersResponse = await axios.get(`${config.BASE_URL}/api/orders/${userId}`);
        setPreviousOrders(ordersResponse.data.orders);

        // Fetch popular foods
        const popularResponse = await axios.get(`${config.BASE_URL}/api/foods/popular`);
        setPopularFoods(popularResponse.data.foods);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Perform search action (just for demo purpose)
  const handleSearch = () => {
    console.log("Searching for:", searchQuery);
    // Here you can implement the search functionality
  };

  // Navigate to restaurant menu on click
  const navigateToMenu = (restaurantId) => {
    navigate(`/restaurant/${restaurantId}`);
  };

  return (
    <>
      <Navbar />
      <MDBContainer className="mt-5">
        <MDBRow>
          <MDBCol md="6" className="mb-4">
            <MDBInput
              label="Search Restaurants by City, Location, Area, or Name"
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </MDBCol>
          <MDBCol md="6" className="mb-4">
            <MDBBtn onClick={handleSearch} color="primary">
              Search
            </MDBBtn>
          </MDBCol>
        </MDBRow>

        <h3>Previously Ordered Foods</h3>
        {loading ? (
          <MDBSpinner color="primary" />
        ) : previousOrders.length > 0 ? (
          previousOrders.map((order) => (
            <MDBCard key={order._id} className="mb-3">
              <MDBCardBody>
                <MDBCardTitle>{order.foodName}</MDBCardTitle>
                <MDBCardText>Ordered on: {new Date(order.date).toLocaleDateString()}</MDBCardText>
                <MDBBtn color="primary" onClick={() => navigateToMenu(order.restaurantId)}>
                  View Menu
                </MDBBtn>
              </MDBCardBody>
            </MDBCard>
          ))
        ) : (
          <p>No previous orders found.</p>
        )}

        <h3 className="mt-5">Popular Foods</h3>
        {loading ? (
          <MDBSpinner color="primary" />
        ) : popularFoods.length > 0 ? (
          popularFoods.map((food) => (
            <MDBCard key={food._id} className="mb-3">
              <MDBCardBody>
                <MDBCardTitle>{food.name}</MDBCardTitle>
                <MDBCardText>{food.description}</MDBCardText>
                <MDBBtn color="primary" onClick={() => navigateToMenu(food.restaurantId)}>
                  View Menu
                </MDBBtn>
              </MDBCardBody>
            </MDBCard>
          ))
        ) : (
          <p>No popular foods found.</p>
        )}
      </MDBContainer>
    </>
  );
};

export default HomePage;
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  MDBNavbar,
  MDBNavbarBrand,
  MDBNavbarNav,
  MDBNavItem,
  MDBNavLink,
  MDBDropdown,
  MDBDropdownToggle,
  MDBDropdownMenu,
  MDBDropdownItem,
} from "mdb-react-ui-kit";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("userId");
    // Add any additional logout logic here (e.g., redux action)
    navigate("/login"); // Redirect to login page
  };

  return (
    <MDBNavbar expand="lg" light bgColor="light">
      <MDBNavbarBrand href="/">Food Delivery</MDBNavbarBrand>
      <MDBNavbarNav right>
        <MDBNavItem>
          <MDBDropdown>
            <MDBDropdownToggle nav>
              <i className="fas fa-user-circle"></i> {/* User icon */}
            </MDBDropdownToggle>
            <MDBDropdownMenu>
              <MDBDropdownItem onClick={() => navigate("/update-profile")}>
                Update Profile
              </MDBDropdownItem>
              <MDBDropdownItem onClick={handleLogout}>
                Logout
              </MDBDropdownItem>
            </MDBDropdownMenu>
          </MDBDropdown>
        </MDBNavItem>
      </MDBNavbarNav>
    </MDBNavbar>
  );
};


