import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import Layout from '../../components/Layout/Layout';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import API_URL from '../../api/apiConfig';
import { useAuth } from '../../context/auth';

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [auth, setAuth] = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // form function
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await axios.post(`${API_URL}/api/v1/auth/login`, {
                email,
                password,
            });
            if (res && res.data.success) {
                toast.success(res.data && res.data.message);
                setAuth({
                    ...auth,
                    user: res.data.user,
                    token: res.data.token
                })
                localStorage.setItem('auth', JSON.stringify(res.data));
                // Introduce a delay before navigating to the home page (e.g., 3 seconds)
                navigate(location.state || '/');
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
            <div className="container">
                <div className="row d-flex justify-content-center align-items-center" style={{ height: "70vh" }}>
                    <div className="col-md-4">
                        <div className="rounded p-3 border">
                            <h1 className="mb-4 text-center">Login Form</h1>
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
                                        type="password"
                                        value={password}
                                        autoComplete="off"
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="form-control"
                                        id="password"
                                        placeholder="Password"
                                        required
                                    />
                                </div>
                                <div className="mb-3 text-center">
                                    <button type="submit" className="btn btn-primary">
                                        Login
                                    </button>
                                </div>
                                <div className="mb-3">
                                    <button type="submit" className="btn btn-link" onClick={() => { navigate('/forgot-password') }}>
                                        Forgot Password
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
