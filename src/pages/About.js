import React from 'react';
import Layout from '../components/Layout/Layout';

const AboutUs = () => {
    return (
        <Layout title={"About Us"}>
            <div className="row aboutus align-items-center">
                <div className='col-md-6 text-center'>
                    <img
                        src="/images/aboutus.jpg"
                        alt="aboutus"
                        style={{ width: "100%" }}
                    />
                </div>
                <div className="col-md-5">
                    <h1 className='bg-dark p-2 text-white text-center'>ABOUT US</h1>
                    <p className='text-justify mt-2'>
                        Welcome to ShopNest, your one-stop destination for all your online shopping needs.
                        We are committed to providing you with the best shopping experience, offering a wide
                        range of products at competitive prices.
                    </p>
                    <p className='text-justify mt-2'>
                        Our mission is to make your online shopping hassle-free and enjoyable. Whether you're
                        looking for the latest fashion trends, electronics, home essentials, or more, ShopNest
                        has got you covered.
                    </p>
                    <p className='text-justify mt-2'>
                        Thank you for choosing ShopNest. We value your trust and look forward to serving you
                        with top-quality products and excellent customer service.
                    </p>
                </div>
            </div>
        </Layout>
    )
}

export default AboutUs;
