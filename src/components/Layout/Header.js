import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/auth';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

const Header = () => {
    const navigate = useNavigate();
    const [auth, setAuth] = useAuth();
    const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);

    const handleLogout = () => {
        setShowLogoutConfirmation(true);
    }

    const confirmLogout = () => {

        // Perform logout
        setAuth({
            ...auth,
            user: null,
            token: ''
        });
        localStorage.removeItem('auth');
        setShowLogoutConfirmation(false);
        navigate('/login');
        toast.success('Logout Successfully');
    }

    const cancelLogout = () => {
        setShowLogoutConfirmation(false);
    }

    return (
        <>
            <nav className="navbar navbar-expand-lg bg-body-tertiary">
                <div className="container-fluid">
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo01" aria-controls="navbarTogglerDemo01" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon" />
                    </button>
                    <div className="collapse navbar-collapse" id="navbarTogglerDemo01">
                        <Link to="/" className="navbar-brand">ShopNest</Link>
                        <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <NavLink to="/" className="nav-link">Home</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink to="/category" className="nav-link">Category</NavLink>
                            </li>
                            {
                                !auth.user ? (
                                    <>
                                        <li className="nav-item">
                                            <NavLink to="/register" className="nav-link">Register</NavLink>
                                        </li>
                                        <li className="nav-item">
                                            <NavLink to="/login" className="nav-link">Login</NavLink>
                                        </li>
                                    </>
                                ) : (
                                    <>
                                        <li className="nav-item dropdown">
                                            <NavLink className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                                {auth?.user?.name}
                                            </NavLink>
                                            <ul className="dropdown-menu">
                                                <li><NavLink to={`/dashboard/${auth?.user?.role === 1 ? 'admin' : 'user'}`} className="dropdown-item" >Dashboard</NavLink></li>
                                                <li>
                                                    <span className="dropdown-item nav-link-logout" onClick={handleLogout}>Logout</span>
                                                </li>
                                            </ul>
                                        </li>
                                    </>
                                )
                            }
                            <li className="nav-item">
                                <NavLink to="/cart" className="nav-link">Cart (0)</NavLink>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

            <Modal show={showLogoutConfirmation} onHide={cancelLogout}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Logout</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to log out?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={cancelLogout}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={confirmLogout}>
                        Logout
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default Header;
