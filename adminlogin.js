import React, { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { authActions } from "../store";
import { useNavigate } from "react-router-dom";
import config from "../config";
import {
  MDBContainer,
  MDBInput,
  MDBCheckbox,
  MDBBtn,
  MDBCard,
  MDBCardBody,
  MDBAlert
} from 'mdb-react-ui-kit';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [inputs, setInputs] = useState({
    email: "",
    password: "",
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [generalError, setGeneralError] = useState("");

  const handleChange = (e) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
    setFieldErrors((prevErrors) => ({ ...prevErrors, [e.target.id]: "" }));
    setGeneralError("");
  };

  const validateFields = () => {
    const errors = {};
    if (!inputs.email) errors.email = "Email is required";
    if (inputs.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inputs.email)) {
      errors.email = "Invalid email address";
    }
    if (!inputs.password) errors.password = "Password is required";

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const sendRequest = async (type = "login") => {
    try {
      const res = await axios.post(`${config.BASE_URL}/api/admin/${type}`, {
        email: inputs.email,
        password: inputs.password,
      });
      return res.data;
    } catch (err) {
      setGeneralError("Something went wrong. Please try again.");
      throw err; // Re-throw the error to handle it later
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateFields()) {
      sendRequest("login")
        .then((data) => {
          if (data.admin) {
            localStorage.setItem("adminId", data.admin._id);
            dispatch(authActions.login());
            navigate("/home"); // Redirect to home page on successful login
          } else {
            setGeneralError("Login failed. Please check your credentials.");
          }
        })
        .catch((err) => {
          console.error(err);
        });
    }
  };

  return (
    <MDBContainer className="mt-5">
      <MDBCard>
        <MDBCardBody>
          <h3 className="text-center mb-4">Login In</h3>
          {generalError && <MDBAlert color="danger">{generalError}</MDBAlert>}
          <form onSubmit={handleSubmit}>
            {/* Email Input */}
            <div className="mb-4">
              <MDBInput
                onChange={handleChange}
                label="Email address"
                id="email"
                type="email"
                className="form-control"
                style={{ backgroundColor: '#f0f8ff' }} // Light background
              />
              {fieldErrors.email && <div className="text-danger">{fieldErrors.email}</div>}
            </div>

            {/* Password Input */}
            <div className="mb-4">
              <MDBInput
                onChange={handleChange}
                label="Password"
                id="password"
                type="password"
                className="form-control"
                style={{ backgroundColor: '#f0f8ff' }} // Light background
              />
              {fieldErrors.password && <div className="text-danger">{fieldErrors.password}</div>}
            </div>

            {/* Checkbox and Links */}
            <div className="mb-4">
              <MDBCheckbox
                name="flexCheck"
                id="flexCheckDefault"
                label="Remember me"
                style={{ color: '#007bff' }} // Primary theme color
              />
              <div className="d-flex justify-content-between">
                <a href='/forget-password'>Forgot password?</a>
                <span>Not a member? <a href='/signup'>Register</a></span>
              </div>
            </div>

            {/* Submit Button */}
            <MDBBtn color="primary" type="submit" block>
              Login
            </MDBBtn>
          </form>
        </MDBCardBody>
      </MDBCard>
    </MDBContainer>
  );
};

export default Login;
