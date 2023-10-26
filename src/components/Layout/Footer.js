import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <div className="footer sticky-footer bg-dark bg-gradient">
            <div className="container">
                <div className="row">
                    <div className="col-md-12 text-center">
                        <h5>&copy; 2023 ShopNest. All Rights Reserved</h5>
                        <p className="my-0">
                            <Link to="/about" className="text-white text-decoration-none mx-2">About</Link>|
                            <Link to="/contact" className="text-white text-decoration-none mx-2">Contact</Link>|
                            <Link to="/policy" className="text-white text-decoration-none mx-2">Privacy Policy</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Footer;
