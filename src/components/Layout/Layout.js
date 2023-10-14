import React from 'react';
import Header from './Header';
import Footer from './Footer';
import { Helmet } from 'react-helmet';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Layout = ({ children, title, description, keywords, author }) => {
    return (
        <div className="layout-container">
            <Helmet>
                <meta charSet="utf-8" />
                <meta name="description" content={description} />
                <meta name="keywords" content={keywords} />
                <meta name="author" content={author} />
                <title>{title}</title>
            </Helmet>
            <Header />
            <main>
                <ToastContainer />
                {children}
            </main>
            <Footer className="sticky-footer" />
        </div>
    );
};

Layout.defaultProps = {
    title: 'ShopNest',
    description: 'An E-commerce App',
    keywords: 'mern, react, node, mongodb',
    author: 'ShopNest',
};

export default Layout;
