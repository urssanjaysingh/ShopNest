import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout/Layout';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import API_URL from '../../api/apiConfig';

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    // State variables for form validation
    const [emailValid, setEmailValid] = useState(true);
    const [passwordValid, setPasswordValid] = useState(true);

    const handleEmailChange = (newEmail) => {
        setEmail(newEmail);
        setEmailValid(newEmail.trim() !== ""); // Basic email validation, checks if it's not empty
    };

    const handlePasswordChange = (newPassword) => {
        setPassword(newPassword);
        setPasswordValid(newPassword.trim() !== ""); // Basic password validation, checks if it's not empty
    };

    // form function
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check if any input is invalid
        if (!emailValid || !passwordValid) {
            return;
        }

        try {
            const res = await axios.post(`${API_URL}/api/v1/auth/login`, {
                email,
                password,
            });
            if (res && res.data.success) {
                toast.success(res.data && res.data.message);
                // Introduce a delay before navigating to the home page (e.g., 3 seconds)
                setTimeout(() => {
                    navigate('/');
                }, 3000); // Adjust the delay time as needed (in milliseconds)
            } else {
                toast.error(res.data.message);
            }
        } catch (error) {
            // Handle 404 errors (Not Found)
            if (error.response && error.response.status === 404) {
                toast.error('Invalid email or password. Please try again.');
            } else {
                console.error(error);
                toast.error('Something went wrong');
            }
        }
    };

    return (
        <Layout title={"Login"}>
            <div className="container mt-5">
                <div className="row justify-content-center">
                    <div className="col-md-4">
                        <div className="rounded p-3 border">
                            <h1 className="mb-4 text-center">Login Form</h1>
                            <form onSubmit={handleSubmit}>
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
                                </div>
                                <div className="text-center">
                                    <button type="submit" className="btn btn-primary">
                                        Login
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

export default Login;
