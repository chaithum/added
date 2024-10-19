import React, { useEffect, useState } from "react";
import axios from "axios"; // For making API requests
import {
  MDBContainer,
  MDBTable,
  MDBTableHead,
  MDBTableBody,
  MDBSpinner,
  MDBCard,
  MDBCardBody,
  MDBBtn,
} from "mdb-react-ui-kit";
import { useNavigate } from "react-router-dom"; // For navigation

const DisplayUsers = () => {
  const [users, setUsers] = useState([]); // Store fetched users
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(""); // Error message state
  const navigate = useNavigate(); // For navigation

  // Fetch users from backend
  const fetchUsers = async () => {
    try {
      const response = await axios.get("/api/users"); // Adjust API path as needed
      setUsers(response.data.users);
    } catch (err) {
      setError("Error fetching users.");
    } finally {
      setLoading(false);
    }
  };

  // Call fetchUsers on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  // Delete a user
  const handleDelete = async (userId) => {
    try {
      await axios.delete(`/api/users/${userId}`); // API call to delete user
      setUsers(users.filter((user) => user._id !== userId)); // Remove user from list
    } catch (err) {
      setError("Error deleting user.");
    }
  };

  // Redirect to update page
  const handleUpdate = (userId) => {
    navigate(`/update-user/${userId}`); // Navigate to update page with user ID
  };

  return (
    <MDBContainer className="mt-5">
      <MDBCard>
        <MDBCardBody>
          <h3 className="text-center mb-4">All Users</h3>
          {loading ? (
            <div className="text-center">
              <MDBSpinner color="primary" />
            </div>
          ) : error ? (
            <p className="text-danger text-center">{error}</p>
          ) : (
            <MDBTable>
              <MDBTableHead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Orders</th>
                  <th>Reviews</th>
                  <th>Actions</th> {/* New column for actions */}
                </tr>
              </MDBTableHead>
              <MDBTableBody>
                {users.length > 0 ? (
                  users.map((user, index) => (
                    <tr key={user._id}>
                      <td>{index + 1}</td>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.orders.length}</td>
                      <td>{user.reviews.length}</td>
                      <td>
                        <MDBBtn
                          size="sm"
                          color="warning"
                          onClick={() => handleUpdate(user._id)}
                        >
                          Update
                        </MDBBtn>{" "}
                        <MDBBtn
                          size="sm"
                          color="danger"
                          onClick={() => handleDelete(user._id)}
                        >
                          Delete
                        </MDBBtn>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center">
                      No users found.
                    </td>
                  </tr>
                )}
              </MDBTableBody>
            </MDBTable>
          )}
        </MDBCardBody>
      </MDBCard>
    </MDBContainer>
  );
};

export default DisplayUsers;
