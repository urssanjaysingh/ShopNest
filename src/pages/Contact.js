import React from 'react';
import Layout from '../components/Layout/Layout';
import { BiMailSend, BiPhoneCall, BiSupport } from 'react-icons/bi';

const Contact = () => {
    return (
        <Layout title={"Contact Us"}>
            <div className="row contactus align-items-center">
                <div className='col-md-6 text-center'>
                    <img
                        src="/images/contactus.jpg"
                        alt="contactus"
                        style={{ width: "70%" }}
                    />
                </div>
                <div className="col-md-4">
                    <h1 className='bg-dark p-2 text-white text-center'>CONTACT US</h1>
                    <p className='text-justify mt-2'>
                        Any query and info about the product, feel free to call anytime; we are available 24X7.
                    </p>
                    <p className="mt-3">
                        <BiMailSend /> : <a href="mailto:help@shopnest.com">help@shopnest.com</a>
                    </p>
                    <p className="mt-3">
                        <BiPhoneCall /> : 012-3456789
                    </p>
                    <p className="mt-3">
                        <BiSupport /> : 1800-0000-0000 (toll free)
                    </p>
                </div>
            </div>
        </Layout>
    )
}

export default Contact;
