import React from 'react';
import Layout from '../components/Layout/Layout';

const PageNotFound = () => {
    const goBack = () => {
        window.history.back();
    };

    return (
        <Layout title={"Page Not Found"}>
            <div className='pnf'>
                <h1 className='pnf-title'>404</h1>
                <h2 className='pnf-heading'>Oops! Page Not Found</h2>
                <button className="btn btn-secondary" onClick={goBack}>Go Back</button>
            </div>
        </Layout>
    );
};

export default PageNotFound;
