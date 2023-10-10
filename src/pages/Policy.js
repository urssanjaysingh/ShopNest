import React from 'react';
import Layout from '../components/Layout/Layout';

const Policy = () => {
    return (
        <Layout title={"Privacy Policy"}>
            <div className="container">
                <h1 className='text-center text-dark mt-5 mb-4'>Privacy Policy</h1>
                <div className="row">
                    <div className="col-md-12 text-center">
                        <img
                            src="/images/privacy-policy.jpg"
                            alt="Privacy Policy"
                            className="img-fluid rounded"
                            style={{ width: "50%" }}
                        />
                    </div>
                    <div className="col-md-12">
                        <p className='mt-4'>
                            At ShopNest, your privacy is important to us. This Privacy Policy explains how we collect,
                            use, and protect your personal information when you use our website and services.
                        </p>
                        <h4 className='mt-4'>Information We Collect</h4>
                        <p>
                            We collect various types of information, such as your name, email address, shipping address,
                            and payment details when you make a purchase or create an account.
                        </p>
                        <h4 className='mt-4'>How We Use Your Information</h4>
                        <p>
                            We use your information to process orders, provide customer support, and enhance our services.
                            Your information may also be used for marketing, but you can opt out of receiving marketing
                            communications.
                        </p>
                        <h4 className='mt-4'>Disclosure of Your Information</h4>
                        <p>
                            We may share your information with third-party service providers to assist in order fulfillment
                            and service provision. We never sell your personal information to third parties.
                        </p>
                        <h4 className='mt-4'>Security</h4>
                        <p>
                            While we take security measures to protect your information, no online transmission or electronic
                            storage method is entirely secure. We cannot guarantee the absolute security of your data.
                        </p>
                        <h4 className='mt-4'>Changes to This Privacy Policy</h4>
                        <p>
                            We may update this Privacy Policy periodically. Please check back regularly for any changes.
                        </p>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default Policy;
