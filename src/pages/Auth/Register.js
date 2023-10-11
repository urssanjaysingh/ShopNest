import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout/Layout';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import API_URL from '../../api/apiConfig';

const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");

    // State variables for form validation
    const [emailValid, setEmailValid] = useState(true);
    const [passwordValid, setPasswordValid] = useState(true);
    const [phoneValid, setPhoneValid] = useState(true);

    // Validation messages
    const [emailMessage, setEmailMessage] = useState("");
    const [passwordMessage, setPasswordMessage] = useState("");
    const [phoneMessage, setPhoneMessage] = useState("");

    const navigate = useNavigate();

    const handleEmailChange = (newEmail) => {
        // Validate email
        const emailRegex = EMAIL_REGEX;
        setEmail(newEmail);
        setEmailValid(emailRegex.test(newEmail));
        setEmailMessage(emailRegex.test(newEmail) ? "" : "Please enter a valid email address.");
    };

    const handlePasswordChange = (newPassword) => {
        // Validate password
        const passwordRegex = PWD_REGEX;
        setPassword(newPassword);
        setPasswordValid(passwordRegex.test(newPassword));
        setPasswordMessage(
            passwordRegex.test(newPassword)
                ? ""
                : "Password must be 8-24 characters and include lowercase, uppercase, number, and special character."
        );
    };

    const handlePhoneChange = (newPhone) => {
        // Validate phone number (length of 10 digits)
        const phoneRegex = /^\d{10}$/;
        setPhone(newPhone);
        setPhoneValid(phoneRegex.test(newPhone));
        setPhoneMessage(phoneRegex.test(newPhone) ? "" : "Phone number must be 10 digits.");
    };

    // form function
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check if any input is invalid
        if (!emailValid || !passwordValid || !phoneValid) {
            return;
        }

        try {
            const res = await axios.post(`${API_URL}/api/v1/auth/register`, {
                name,
                email,
                password,
                phone,
                address,
            });
            if (res && res.data.success) {
                toast.success(res.data && res.data.message);
                // Introduce a delay before navigating to the login page (e.g., 3 seconds)
                setTimeout(() => {
                    navigate('/login');
                }, 3000); // Adjust the delay time as needed (in milliseconds)
            } else {
                toast.error(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error('Something went wrong');
        }
    };

    return (
        <Layout title={"Register"}>
            <div className="container mt-5">
                <div className="row justify-content-center">
                    <div className="col-md-4">
                        <div className="rounded p-3 border">
                            <h1 className="mb-4 text-center">Register Form</h1>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <input
                                        type="text"
                                        value={name}
                                        autoComplete="off"
                                        onChange={(e) => setName(e.target.value)}
                                        className="form-control"
                                        id="name"
                                        placeholder="Name"
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <input
                                        type="email"
                                        value={email}
                                        autoComplete="off"
                                        onChange={(e) => handleEmailChange(e.target.value)}
                                        className={`form-control ${emailValid ? "" : "is-invalid"}`}
                                        id="email"
                                        placeholder="Email"
                                        required
                                    />
                                    {/* Display email validation message */}
                                    {emailMessage && <div className="invalid-feedback">{emailMessage}</div>}
                                </div>
                                <div className="mb-3">
                                    <input
                                        type="password"
                                        value={password}
                                        autoComplete="off"
                                        onChange={(e) => handlePasswordChange(e.target.value)}
                                        className={`form-control ${passwordValid ? "" : "is-invalid"}`}
                                        id="password"
                                        placeholder="Password"
                                        required
                                    />
                                    {/* Display password validation message */}
                                    {passwordMessage && <div className="invalid-feedback">{passwordMessage}</div>}
                                </div>
                                <div className="mb-3">
                                    <input
                                        type="tel"
                                        value={phone}
                                        autoComplete="off"
                                        onChange={(e) => handlePhoneChange(e.target.value)}
                                        className={`form-control ${phoneValid ? "" : "is-invalid"}`}
                                        id="phone"
                                        placeholder="Phone"
                                        required
                                    />
                                    {/* Display phone validation message */}
                                    {phoneMessage && <div className="invalid-feedback">{phoneMessage}</div>}
                                </div>
                                <div className="mb-3">
                                    <input
                                        type="text"
                                        value={address}
                                        autoComplete="off"
                                        onChange={(e) => setAddress(e.target.value)}
                                        className="form-control"
                                        id="address"
                                        placeholder="Address"
                                        required
                                    />
                                </div>
                                <div className="text-center">
                                    <button type="submit" className="btn btn-primary">
                                        Register
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Register;
