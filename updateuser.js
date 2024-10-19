import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import {
  MDBContainer,
  MDBInput,
  MDBBtn,
  MDBCard,
  MDBCardBody,
  MDBSpinner,
} from "mdb-react-ui-kit";

const UpdateUser = () => {
  const { id } = useParams(); // Get user ID from URL
  const [user, setUser] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(""); // Error message state
  const navigate = useNavigate(); // For navigation

  // Fetch user details from the backend
  const fetchUser = async () => {
    try {
      const response = await axios.get(`/api/users/${id}`); // Fetch user by ID
      setUser(response.data.user);
    } catch (err) {
      setError("Error fetching user details.");
    } finally {
      setLoading(false);
    }
  };

  // Update user details
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/users/${id}`, user); // Update user by ID
      navigate("/display-users"); // Redirect to users list after update
    } catch (err) {
      setError("Error updating user.");
    }
  };

  // Handle form input changes
  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  // Fetch user details on component mount
  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <MDBContainer className="mt-5">
      {loading ? (
        <div className="text-center">
          <MDBSpinner color="primary" />
        </div>
      ) : (
        <MDBCard>
          <MDBCardBody>
            <h3 className="text-center mb-4">Update User</h3>
            {error && <p className="text-danger text-center">{error}</p>}
            <form onSubmit={handleUpdate}>
              <div className="mb-4">
                <label>Name</label>
                <MDBInput
                  type="text"
                  name="name"
                  value={user.name}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
              <div className="mb-4">
                <label>Email</label>
                <MDBInput
                  type="email"
                  name="email"
                  value={user.email}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
              <div className="text-center">
                <MDBBtn type="submit" color="primary">
                  Update
                </MDBBtn>
              </div>
            </form>
          </MDBCardBody>
        </MDBCard>
      )}
    </MDBContainer>
  );
};

export default UpdateUser;
