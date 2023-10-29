import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout/Layout';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import API_URL from '../../api/apiConfig';

const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [passwordValid, setPasswordValid] = useState(true);
    const [passwordMessage, setPasswordMessage] = useState("");
    const [answer, setAnswer] = useState("");
    const navigate = useNavigate();

    const handlePasswordChange = (newPassword) => {
        const passwordRegex = PWD_REGEX;
        setNewPassword(newPassword);
        setPasswordValid(passwordRegex.test(newPassword));
        setPasswordMessage(
            passwordRegex.test(newPassword)
                ? ""
                : "Password must be 8-24 characters and include lowercase, uppercase, number, and special character."
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!passwordValid) {
            return;
        }

        try {
            const res = await axios.post(`${API_URL}/api/v1/auth/forgot-password`, {
                email,
                answer,
                newPassword,
            });
            if (res && res.data.success) {
                toast.success(res.data && res.data.message);
                navigate('/login');
            } else {
                toast.error(res.data.message);
            }
        } catch (error) {
            if (error.response && error.response.status === 404) {
                toast.error('Invalid email or answer. Please try again.');
            } else {
                console.error(error);
                toast.error('Something went wrong');
            }
        }
    };

    return (
        <Layout title={"Forgot Password"}>
            <div className="container mt-5">
                <div className="row justify-content-center">
                    <div className="col-md-4">
                        <div className="rounded p-3 border">
                            <h1 className="mb-4 text-center">Forgot Password</h1>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="form-control"
                                        id="email"
                                        placeholder="Email"
                                        required
                                        autoComplete='off'
                                    />
                                </div>
                                <div className="mb-3">
                                    <input
                                        type="text"
                                        value={answer}
                                        onChange={(e) => setAnswer(e.target.value)}
                                        className="form-control"
                                        id="answer"
                                        placeholder="Enter Your Favorite Pet Name?"
                                        required
                                        autoComplete='off'
                                    />
                                </div>
                                <div className="mb-3">
                                    <input
                                        type="password"
                                        value={newPassword}
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
                                <div className="mb-3 text-center">
                                    <button type="submit" className="btn btn-primary">
                                        Reset Password
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default ForgotPassword
