import React, { useState, useEffect } from 'react'
import Layout from '../../components/Layout/Layout'
import UserMenu from '../../components/Layout/UserMenu'
import { useAuth } from '../../context/auth'
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import API_URL from '../../api/apiConfig';

const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

const Profile = () => {

    const [auth, setAuth] = useAuth();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");

    const [passwordValid, setPasswordValid] = useState(true);
    const [phoneValid, setPhoneValid] = useState(true);

    const [passwordMessage, setPasswordMessage] = useState("");
    const [phoneMessage, setPhoneMessage] = useState("");

    useEffect(() => {
        const { email, name, phone, address } = auth?.user
        setName(name)
        setPhone(phone)
        setEmail(email)
        setAddress(address)
    }, [auth?.user])

    const handlePasswordChange = (newPassword) => {
        if (newPassword === "") {
            setPassword(newPassword);
            setPasswordMessage("");
            setPasswordValid(true);
        } else {
            const passwordRegex = PWD_REGEX;
            setPassword(newPassword);
            setPasswordValid(passwordRegex.test(newPassword));
            setPasswordMessage(
                passwordRegex.test(newPassword)
                    ? ""
                    : "Password must be 8-24 characters and include lowercase, uppercase, number, and special character."
            );
        }
    };

    const handlePhoneChange = (newPhone) => {
        const phoneRegex = /^\d{10}$/;
        setPhone(newPhone);
        setPhoneValid(phoneRegex.test(newPhone));
        setPhoneMessage(phoneRegex.test(newPhone) ? "" : "Phone number must be 10 digits.");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!passwordValid || !phoneValid) {
            return;
        }

        try {
            const { data } = await axios.put(`${API_URL}/api/v1/auth/profile`, {
                name,
                email,
                password,
                phone,
                address,
            });
            if (data?.error) {
                toast.error(data?.error)
            } else {
                setAuth({ ...auth, user: data?.updatedUser })
                let ls = localStorage.getItem("auth")
                ls = JSON.parse(ls)
                ls.user = data.updatedUser
                localStorage.setItem("auth", JSON.stringify(ls))
                toast.success('Profile Updated Successfully')
            }
        } catch (error) {
            console.log(error);
            toast.error('Something went wrong');
        }
    };

    return (
        <Layout title={'Your Profile'}>
            <div className="container-fluid m-3 p-3">
                <div className="row">
                    <div className="col-md-3">
                        <UserMenu />
                    </div>
                    <div className="col-md-9">
                        <div className="container mt-5">
                            <div className="row justify-content-center">
                                <div className="col-md-4">
                                    <div className="rounded p-3 border">
                                        <h1 className="mb-4 text-center">User Profile</h1>
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
                                                />
                                            </div>
                                            <div className="mb-3">
                                                <input
                                                    type="email"
                                                    value={email}
                                                    autoComplete="off"
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    className={'form-control'}
                                                    id="email"
                                                    placeholder="Email"
                                                    disabled
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
                                                />
                                            </div>
                                            <div className="text-center">
                                                <button type="submit" className="btn btn-primary">
                                                    Update
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default Profile
