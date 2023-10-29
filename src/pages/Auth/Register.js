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
    const [answer, setAnswer] = useState("");

    const [emailValid, setEmailValid] = useState(true);
    const [passwordValid, setPasswordValid] = useState(true);
    const [phoneValid, setPhoneValid] = useState(true);

    const [emailMessage, setEmailMessage] = useState("");
    const [passwordMessage, setPasswordMessage] = useState("");
    const [phoneMessage, setPhoneMessage] = useState("");

    const navigate = useNavigate();

    const handleEmailChange = (newEmail) => {
        const emailRegex = EMAIL_REGEX;
        setEmail(newEmail);
        setEmailValid(emailRegex.test(newEmail));
        setEmailMessage(emailRegex.test(newEmail) ? "" : "Please enter a valid email address.");
    };

    const handlePasswordChange = (newPassword) => {
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
        const phoneRegex = /^\d{10}$/;
        setPhone(newPhone);
        setPhoneValid(phoneRegex.test(newPhone));
        setPhoneMessage(phoneRegex.test(newPhone) ? "" : "Phone number must be 10 digits.");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

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
                answer
            });
            if (res && res.data.success) {
                toast.success(res.data && res.data.message);
                navigate('/login');
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
            <div className="register container">
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
                                <div className="mb-3">
                                    <input
                                        type="text"
                                        value={answer}
                                        autoComplete="off"
                                        onChange={(e) => setAnswer(e.target.value)}
                                        className="form-control"
                                        id="answer"
                                        placeholder="What is Your Favorite Pet Name?"
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
