import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/auth';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import SearchInput from '../Form/SearchInput';
import useCategory from '../../hooks/useCategory';
import { useCart } from '../../context/cart';
import { Badge } from 'antd'

const Header = () => {
    const navigate = useNavigate();
    const [auth, setAuth] = useAuth();
    const [cart] = useCart()
    const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);

    const categories = useCategory()

    const handleLogout = () => {
        setShowLogoutConfirmation(true);
    }

    const confirmLogout = () => {

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
            <nav className="navbar navbar-expand-lg bg-light bg-gradient">
                <div className="container-fluid">
                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarTogglerDemo01"
                        aria-controls="navbarTogglerDemo01"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <i className="fas fa-bars"></i>
                    </button>
                    <Link to="/" className="navbar-brand"><i className="fas fa-store"></i> ShopNest</Link>
                    <div className="collapse navbar-collapse" id="navbarTogglerDemo01">
                        <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                            <li className="nav-item mx-auto">
                                <SearchInput />
                            </li>
                        </ul>
                        <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <NavLink to="/" className="nav-link"><i className="fas fa-home"></i> Home</NavLink>
                            </li>
                            <li className="nav-item dropdown">
                                <Link
                                    className="nav-link dropdown-toggle"
                                    to={"/categories"}
                                    data-bs-toggle="dropdown"
                                >
                                    <i className="fas fa-list"></i> Categories
                                </Link>
                                <ul className="dropdown-menu">
                                    <li>
                                        <Link className='dropdown-item bg-light' to={"/categories"}>
                                            <i className="fas fa-list"></i> All Categories
                                        </Link>
                                    </li>
                                    {categories?.map((c, i) => (
                                        <li key={i}>
                                            <Link
                                                className="dropdown-item bg-light"
                                                to={`/category/${c.slug}`}
                                            >
                                                <i className="fas fa-folder"></i> {c.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </li>
                            {
                                !auth.user ? (
                                    <>
                                        <li className="nav-item">
                                            <NavLink to="/register" className="nav-link"><i className="fas fa-user-plus"></i> Register</NavLink>
                                        </li>
                                        <li className="nav-item">
                                            <NavLink to="/login" className="nav-link"><i className="fas fa-sign-in-alt"></i> Login</NavLink>
                                        </li>
                                    </>
                                ) : (
                                    <>
                                        <li className="nav-item dropdown">
                                            <NavLink className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                                <i className="fas fa-user"></i> {auth?.user?.name}
                                            </NavLink>
                                            <ul className="dropdown-menu">
                                                <li><NavLink to={`/dashboard/${auth?.user?.role === 1 ? 'admin' : 'user'}`} className="dropdown-item" ><i className="fas fa-tachometer-alt"></i> Dashboard</NavLink></li>
                                                <li>
                                                    <span className="dropdown-item nav-link-logout" onClick={handleLogout}><i className="fas fa-sign-out-alt"></i> Logout</span>
                                                </li>
                                            </ul>
                                        </li>
                                    </>
                                )
                            }
                            <li className="nav-item">
                                <NavLink to="/cart" className="nav-link">
                                    <i className="fas fa-shopping-cart"></i> Cart <Badge count={cart?.length} showZero></Badge>
                                </NavLink>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav >

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
