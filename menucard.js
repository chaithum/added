import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom"; // For getting restaurant ID from URL
import config from "../config"; // Your config file for API base URL
import {
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
  MDBCardText,
  MDBRow,
  MDBCol,
  MDBSpinner,
  MDBAlert,
  MDBBtn,
} from "mdb-react-ui-kit";

const RestaurantMenu = () => {
  const { id } = useParams(); // Get restaurant ID from the URL
  const [items, setItems] = useState([]); // To store food items
  const [cartItems, setCartItems] = useState([]); // To store cart items
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(""); // Error message state

  // Fetch food items based on restaurant ID
  const fetchItems = async () => {
    try {
      const response = await axios.get(`${config.BASE_URL}/api/restaurants/${id}/items`);
      setItems(response.data.items);
    } catch (err) {
      setError("Error fetching items.");
    } finally {
      setLoading(false);
    }
  };

  // Call fetchItems on component mount
  useEffect(() => {
    fetchItems();
  }, [id]);

  // Handle adding item to cart
  const handleAddToCart = (item) => {
    // Check if the item is already in the cart
    const isItemInCart = cartItems.some((cartItem) => cartItem._id === item._id);
    if (!isItemInCart) {
      setCartItems([...cartItems, item]); // Add item to cart if not already added
    }
  };

  // Check if an item is already added to cart
  const isAddedToCart = (itemId) => {
    return cartItems.some((item) => item._id === itemId);
  };

  return (
    <MDBContainer className="mt-5">
      <MDBCard>
        <MDBCardBody>
          <MDBCardTitle className="text-center">Menu</MDBCardTitle>

          {loading ? (
            <div className="text-center">
              <MDBSpinner color="primary" />
            </div>
          ) : error ? (
            <MDBAlert color="danger" className="text-center">{error}</MDBAlert>
          ) : (
            <MDBRow>
              {items.length > 0 ? (
                items.map((item) => (
                  <MDBCol md="4" key={item._id} className="mb-4">
                    <MDBCard>
                      <MDBCardBody>
                        <MDBCardTitle>{item.name}</MDBCardTitle>
                        <MDBCardText>{item.description}</MDBCardText>
                        <MDBCardText>Price: ${item.price.toFixed(2)}</MDBCardText>
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="img-fluid mb-3"
                          style={{ height: "200px", objectFit: "cover" }}
                        />

                        {/* If the item is already added to cart, change button text */}
                        {isAddedToCart(item._id) ? (
                          <MDBBtn color="success" disabled>
                            Added to Cart
                          </MDBBtn>
                        ) : (
                          <MDBBtn color="primary" onClick={() => handleAddToCart(item)}>
                            Add to Cart
                          </MDBBtn>
                        )}
                      </MDBCardBody>
                    </MDBCard>
                  </MDBCol>
                ))
              ) : (
                <MDBAlert color="info" className="text-center" colSpan="4">
                  No items found for this restaurant.
                </MDBAlert>
              )}
            </MDBRow>
          )}
        </MDBCardBody>
      </MDBCard>
    </MDBContainer>
  );
};

export default RestaurantMenu;
