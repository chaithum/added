import React, { useState } from "react";
import axios from "axios";
import {
  MDBContainer,
  MDBInput,
  MDBBtn,
  MDBCard,
  MDBCardBody,
  MDBAlert
} from "mdb-react-ui-kit";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "./Signup.css"; // Import your custom CSS
import config from "../config";

const Signup = () => {
  const navigate = useNavigate(); // Initialize useNavigate
  const [inputs, setInputs] = useState({
    full_name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [fieldErrors, setFieldErrors] = useState({});
  const [generalError, setGeneralError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isUsernameValid, setIsUsernameValid] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [isConfirmPasswordValid, setIsConfirmPasswordValid] = useState(false);

  // Validate username
  const validateUsername = async (username) => {
    if (username.length < 6) {
      setFieldErrors((prev) => ({ ...prev, full_name: "Username must be at least 6 characters" }));
      setIsUsernameValid(false);
      return;
    }
    try {
      const res = await axios.get(`${config.BASE_URL}/api/check-username?username=${username}`);
      if (res.data.exists) {
        setFieldErrors((prev) => ({ ...prev, full_name: "Username already exists" }));
        setIsUsernameValid(false);
      } else {
        setFieldErrors((prev) => ({ ...prev, full_name: "" }));
        setIsUsernameValid(true);
      }
    } catch (err) {
      console.error("Error checking username:", err);
    }
  };

  // Validate email
  const validateEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailPattern.test(email)) {
      setFieldErrors((prev) => ({ ...prev, email: "" }));
      setIsEmailValid(true);
    } else {
      setFieldErrors((prev) => ({ ...prev, email: "Invalid email address" }));
      setIsEmailValid(false);
    }
  };

  // Validate password
  const validatePassword = (password) => {
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    if (passwordPattern.test(password)) {
      setFieldErrors((prev) => ({ ...prev, password: "" }));
      setIsPasswordValid(true);
    } else {
      setFieldErrors((prev) => ({
        ...prev,
        password: "Password must be at least 6 characters, contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
      }));
      setIsPasswordValid(false);
    }
  };

  // Validate confirm password
  const validateConfirmPassword = (confirmPassword) => {
    if (confirmPassword === inputs.password) {
      setFieldErrors((prev) => ({ ...prev, confirmPassword: "" }));
      setIsConfirmPasswordValid(true);
    } else {
      setFieldErrors((prev) => ({ ...prev, confirmPassword: "Passwords do not match" }));
      setIsConfirmPasswordValid(false);
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setInputs((prevState) => ({ ...prevState, [id]: value }));

    if (id === "full_name") {
      validateUsername(value);
    } else if (id === "email") {
      validateEmail(value);
    } else if (id === "password") {
      validatePassword(value);
      validateConfirmPassword(inputs.confirmPassword);
    } else if (id === "confirmPassword") {
      validateConfirmPassword(value);
    }

    setGeneralError("");
    setSuccessMessage("");
  };

  const validateFields = () => {
    const errors = {};
    if (!inputs.full_name) errors.full_name = "Full name is required";
    if (!inputs.email) errors.email = "Email is required";
    if (!inputs.password) errors.password = "Password is required";
    if (!isUsernameValid) errors.full_name = "Invalid username";
    if (!isEmailValid) errors.email = "Invalid email";
    if (!isPasswordValid) errors.password = "Invalid password";
    if (!isConfirmPasswordValid) errors.confirmPassword = "Confirm password is invalid";

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const sendRequest = async () => {
    try {
      const res = await axios.post(`${config.BASE_URL}/api/admin/signup`, {
        email: inputs.email,
        password: inputs.password,
      });
      return res.data;
    } catch (err) {
      setGeneralError("Something went wrong. Please try again.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateFields()) {
      const data = await sendRequest();
      if (data && data.success) {
        setSuccessMessage("Signup successful! Please check your email to verify.");
        setInputs({ full_name: "", email: "", password: "", confirmPassword: "" });
        setIsUsernameValid(false);
        setIsEmailValid(false);
        setIsPasswordValid(false);
        setIsConfirmPasswordValid(false);
        
        // Redirect to login page after signup
        navigate("/login"); // Change "/login" to the actual path of your login page
      } else {
        setGeneralError("Signup failed. Please try again.");
      }
    }
  };

  return (
    <MDBContainer className="mt-5 d-flex justify-content-center">
      <MDBCard style={{ maxWidth: "500px", width: "100%" }}>
        <MDBCardBody>
          <h3 className="text-center mb-4">Sign Up</h3>

          {successMessage && <MDBAlert color="success">{successMessage}</MDBAlert>}
          {generalError && <MDBAlert color="danger">{generalError}</MDBAlert>}

          <form onSubmit={handleSubmit}>
            <MDBInput
              label="Full Name"
              id="full_name"
              value={inputs.full_name}
              onChange={handleChange}
              style={{ borderColor: isUsernameValid ? "green" : fieldErrors.full_name ? "red" : "" }}
            />
            {fieldErrors.full_name && <div className="text-danger">{fieldErrors.full_name}</div>}

            <MDBInput
              label="Email Address"
              id="email"
              type="email"
              value={inputs.email}
              onChange={handleChange}
              style={{ borderColor: isEmailValid ? "green" : fieldErrors.email ? "red" : "" }}
            />
            {fieldErrors.email && <div className="text-danger">{fieldErrors.email}</div>}

            <MDBInput
              label="Password"
              id="password"
              type="password"
              value={inputs.password}
              onChange={handleChange}
              style={{ borderColor: isPasswordValid ? "green" : fieldErrors.password ? "red" : "" }}
            />
            {fieldErrors.password && <div className="text-danger">{fieldErrors.password}</div>}

            <MDBInput
              label="Confirm Password"
              id="confirmPassword"
              type="password"
              value={inputs.confirmPassword}
              onChange={handleChange}
              style={{ borderColor: isConfirmPasswordValid ? "green" : fieldErrors.confirmPassword ? "red" : "" }}
            />
            {fieldErrors.confirmPassword && <div className="text-danger">{fieldErrors.confirmPassword}</div>}

            <MDBBtn color="primary" type="submit" block disabled={!isUsernameValid || !isEmailValid || !isPasswordValid || !isConfirmPasswordValid}>
              Sign Up
            </MDBBtn>
          </form>
        </MDBCardBody>
      </MDBCard>
    </MDBContainer>
  );
};

export default Signup;
