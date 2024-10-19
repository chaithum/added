import React, { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { authActions } from "../store";
import { useNavigate } from "react-router-dom";
import config from "../config";
import {
    MDBContainer,
    MDBInput,
    MDBBtn,
    MDBCard,
    MDBCardBody,
    MDBAlert,
} from 'mdb-react-ui-kit';

const Forget = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [inputs, setInputs] = useState({
        email: "",
        password: "",
        confirm_password: ""
    });
    const [fieldErrors, setFieldErrors] = useState({});
    const [generalError, setGeneralError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const handleChange = (e) => {
        setInputs((prevState) => ({
            ...prevState,
            [e.target.id]: e.target.value,
        }));
        setFieldErrors((prevErrors) => ({ ...prevErrors, [e.target.id]: "" }));
        setGeneralError("");
        setSuccessMessage("");
    };

    const validateFields = () => {
        const errors = {};
        if (!inputs.email) errors.email = "Email is required";
        if (inputs.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inputs.email)) {
            errors.email = "Invalid email address";
        }
        if (!inputs.password) errors.password = "Password is required";
        if (inputs.password && inputs.password.length < 6) {
            errors.password = "Password must be at least 6 characters";
        }
        if (!inputs.confirm_password) errors.confirm_password = "Confirm password is required";
        if (inputs.password !== inputs.confirm_password) {
            errors.confirm_password = "Passwords do not match";
        }

        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const sendRequest = async (type = "forget") => {
        try {
            const res = await axios.post(`${config.BASE_URL}/api/admin/${type}`, {
                email: inputs.email,
                password: inputs.password,
            });
            return res.data;
        } catch (err) {
            setGeneralError("Something went wrong. Please try again.");
            console.error(err);
            return null;
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateFields()) {
            sendRequest("forget")
                .then((data) => {
                    if (data && data.success) { // Assuming the response has a success field
                        setSuccessMessage("Password updated successfully. Redirecting to login...");
                        setTimeout(() => navigate("/login"), 2000); // Redirect to login page after 2 seconds
                    } else {
                        setGeneralError("Failed to update password. Please check your credentials.");
                    }
                });
        }
    };

    return (
        <MDBContainer className="mt-5">
            <MDBCard>
                <MDBCardBody>
                    <h3 className="text-center mb-4">Update Password</h3>
                    {generalError && <MDBAlert color="danger">{generalError}</MDBAlert>}
                    {successMessage && <MDBAlert color="success">{successMessage}</MDBAlert>}
                    <form onSubmit={handleSubmit}>
                        {/* Email Input */}
                        <div className="mb-4">
                            <MDBInput
                                onChange={handleChange}
                                label="Email address"
                                id="email"
                                type="email"
                                className={`form-control ${fieldErrors.email ? 'is-invalid' : ''}`}
                                style={{ backgroundColor: '#f0f8ff' }} // Light background
                            />
                            {fieldErrors.email && <div className="text-danger">{fieldErrors.email}</div>}
                        </div>
                        {/* Password Input */}
                        <div className="mb-4">
                            <MDBInput
                                onChange={handleChange}
                                label="New Password"
                                id="password"
                                type="password"
                                className={`form-control ${fieldErrors.password ? 'is-invalid' : ''}`}
                                style={{ backgroundColor: '#f0f8ff' }} // Light background
                            />
                            {fieldErrors.password && <div className="text-danger">{fieldErrors.password}</div>}
                        </div>
                        {/* Confirm Password Input */}
                        <div className="mb-4">
                            <MDBInput
                                onChange={handleChange}
                                label="Confirm New Password"
                                id="confirm_password"
                                type="password"
                                className={`form-control ${fieldErrors.confirm_password ? 'is-invalid' : ''}`}
                                style={{ backgroundColor: '#f0f8ff' }} // Light background
                            />
                            {fieldErrors.confirm_password && <div className="text-danger">{fieldErrors.confirm_password}</div>}
                        </div>
                        {/* Submit Button */}
                        <MDBBtn color="primary" type="submit" block>
                            Update Password
                        </MDBBtn>
                    </form>
                </MDBCardBody>
            </MDBCard>
        </MDBContainer>
    );
};

export default Forget;
