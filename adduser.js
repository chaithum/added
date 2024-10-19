import React, { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom"; // Added Link from react-router-dom
import { authActions } from "../store";
import ReCAPTCHA from "react-google-recaptcha";
import config from "../config";
import {
  MDBContainer,
  MDBInput,
  MDBCard,
  MDBCardBody,
  MDBBtn,
  MDBAlert,
} from "mdb-react-ui-kit";

const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // State for form inputs, validation states, and error messages
  const [inputs, setInputs] = useState({
    username: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });
  const [captchaValid, setCaptchaValid] = useState(false);
  const [error, setError] = useState("");
  const [validation, setValidation] = useState({
    usernameValid: false,
    emailValid: false,
    phoneNumberValid: false,
    passwordValid: false,
    confirmPasswordValid: false,
  });

  // Handle form input changes
  const handleChange = (e) => {
    const { id, value } = e.target;
    setInputs((prevState) => ({
      ...prevState,
      [id]: value,
    }));

    // Validate the field as it's updated
    validateField(id, value);
  };

  // reCAPTCHA validation
  const onCaptchaChange = (value) => {
    setCaptchaValid(!!value);
  };

  // Email validation function
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Phone number validation: Ensure exactly 10 digits
  const isValidPhoneNumber = (phoneNumber) => {
    const phonePattern = /^\d{10}$/;
    return phonePattern.test(phoneNumber);
  };

  // Validate each field
  const validateField = (id, value) => {
    switch (id) {
      case "username":
        setValidation((prevState) => ({
          ...prevState,
          usernameValid: !!value.trim(), // Simple check for non-empty value
        }));
        break;
      case "email":
        setValidation((prevState) => ({
          ...prevState,
          emailValid: isValidEmail(value),
        }));
        break;
      case "phoneNumber":
        if (value.length > 10) {
          showError("Phone number must be exactly 10 digits.");
        }
        setValidation((prevState) => ({
          ...prevState,
          phoneNumberValid: isValidPhoneNumber(value),
        }));
        break;
      case "password":
        setValidation((prevState) => ({
          ...prevState,
          passwordValid: value.length >= 6, // Minimum 6 characters for password
        }));
        break;
      case "confirmPassword":
        setValidation((prevState) => ({
          ...prevState,
          confirmPasswordValid: value === inputs.password, // Passwords must match
        }));
        break;
      default:
        break;
    }
  };

  // Show error messages
  const showError = (message) => {
    setError(message);
    setTimeout(() => setError(""), 3000); // Clear error after 3 seconds
  };

  // Send request to the backend API for signup
  const sendRequest = async (type = "signup") => {
    try {
      const res = await axios.post(`${config.BASE_URL}/api/users/${type}`, {
        username: inputs.username,
        email: inputs.email,
        phoneNumber: inputs.phoneNumber,
        password: inputs.password,
      });
      const data = await res.data;
      return data;
    } catch (err) {
      console.log(err);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // All validation must pass before submission
    if (
      !validation.usernameValid ||
      !validation.emailValid ||
      !validation.phoneNumberValid ||
      !validation.passwordValid ||
      !validation.confirmPasswordValid ||
      !captchaValid
    ) {
      showError("Please ensure all fields are correctly filled out.");
      return;
    }

    // If all validations pass
    const data = await sendRequest();
    if (data) {
      localStorage.setItem("userId", data.user._id);
      dispatch(authActions.login());
      navigate("/welcome"); // Navigate to the welcome page after signup
    }
  };

  return (
    <MDBContainer className="mt-5">
      <MDBCard>
        <MDBCardBody>
          <h3 className="text-center mb-4">Sign Up</h3>

          {/* Error message display */}
          {error && (
            <MDBAlert color="danger" className="text-center">
              {error}
            </MDBAlert>
          )}

          <form onSubmit={handleSubmit}>
            {/* Username Field */}
            <div className="mb-4">
              <label>Username</label>
              <MDBInput
                onChange={handleChange}
                id="username"
                type="text"
                value={inputs.username}
                className="form-control"
                style={{ backgroundColor: "#f0f8ff" }}
              />
            </div>

            {/* Email Field - Enabled only if username is valid */}
            <div className="mb-4">
              <label>Email</label>
              <MDBInput
                onChange={handleChange}
                id="email"
                type="email"
                value={inputs.email}
                disabled={!validation.usernameValid} // Disable until username is valid
                className="form-control"
                style={{ backgroundColor: "#f0f8ff" }}
              />
            </div>

            {/* Phone Number Field - Enabled only if email is valid */}
            <div className="mb-4">
              <label>Phone Number</label>
              <MDBInput
                onChange={handleChange}
                id="phoneNumber"
                type="text"
                value={inputs.phoneNumber}
                maxLength={10} // Limit input to 10 digits
                disabled={!validation.emailValid} // Disable until email is valid
                className="form-control"
                style={{ backgroundColor: "#f0f8ff" }}
              />
            </div>

            {/* Password Field - Enabled only if phone number is valid */}
            <div className="mb-4">
              <label>Password</label>
              <MDBInput
                onChange={handleChange}
                id="password"
                type="password"
                value={inputs.password}
                disabled={!validation.phoneNumberValid} // Disable until phone number is valid
                className="form-control"
                style={{ backgroundColor: "#f0f8ff" }}
              />
            </div>

            {/* Confirm Password Field - Enabled only if password is valid */}
            <div className="mb-4">
              <label>Confirm Password</label>
              <MDBInput
                onChange={handleChange}
                id="confirmPassword"
                type="password"
                value={inputs.confirmPassword}
                disabled={!validation.passwordValid} // Disable until password is valid
                className="form-control"
                style={{ backgroundColor: "#f0f8ff" }}
              />
            </div>

            {/* reCAPTCHA Field */}
            <div className="mb-4">
              <ReCAPTCHA
                sitekey="YOUR_GOOGLE_RECAPTCHA_SITE_KEY" // Replace with your actual site key
                onChange={onCaptchaChange}
              />
            </div>

            {/* Submit Button */}
            <div className="text-center">
              <MDBBtn
                type="submit"
                color="primary"
                disabled={!captchaValid || !validation.confirmPasswordValid} // Disable until all fields are valid and captcha is done
              >
                Sign Up
              </MDBBtn>
            </div>
          </form>

          {/* Already have an account? */}
          <div className="text-center mt-3">
            <p>
              Already have an account?{" "}
              <Link to="/login">Log in here</Link>
            </p>
          </div>
        </MDBCardBody>
      </MDBCard>
    </MDBContainer>
  );
};

export default Signup;
