// RestaurantMenu.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom"; // For getting restaurant ID from URL
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
  const navigate = useNavigate(); // Initialize navigate
  const [items, setItems] = useState([]); // To store food items
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

  // Handle delete item
  const handleDelete = async (itemId) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        await axios.delete(`${config.BASE_URL}/api/items/${itemId}`);
        fetchItems(); // Refresh item list after deletion
      } catch (err) {
        setError("Error deleting item.");
      }
    }
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
                        <img src={item.imageUrl} alt={item.name} className="img-fluid" />
                        <MDBBtn color="primary" onClick={() => navigate(`/update-item/${item._id}`)}>
                          Update
                        </MDBBtn>
                        <MDBBtn color="danger" onClick={() => handleDelete(item._id)} className="ms-2">
                          Delete
                        </MDBBtn>
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
