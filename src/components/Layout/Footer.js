import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <div className='footer bg-dark text-white p-4'>
            <div className="container">
                <div className="row">
                    <div className="col-md-12 text-center">
                        <h4>&copy; 2023 ShopNest. All Rights Reserved</h4>
                        <p className="mt-3">
                            <Link to="/about" className="text-white">About</Link> |
                            <Link to="/contact" className="text-white">Contact</Link> |
                            <Link to="/policy" className="text-white">Privacy Policy</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Footer;
