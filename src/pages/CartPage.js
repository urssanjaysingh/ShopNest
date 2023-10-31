import React, { useState, useEffect } from 'react'
import Layout from './../components/Layout/Layout'
import { useCart } from '../context/cart'
import { useAuth } from '../context/auth'
import { useNavigate } from 'react-router-dom'
import DropIn from "braintree-web-drop-in-react";
import axios from 'axios'
import API_URL from '../api/apiConfig'
import { toast } from 'react-toastify'

const CartPage = () => {
    const [auth, setAuth] = useAuth()
    const [cart, setCart] = useCart()
    const [clientToken, setClientToken] = useState('')
    const [instanse, setInstance] = useState('')
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()

    const totalPrice = () => {
        try {
            const total = cart?.reduce((acc, item) => acc + item.price, 0);
            const formattedTotal = total.toLocaleString("en-IN", {
                style: "currency",
                currency: "INR",
                minimumFractionDigits: 2,
            });
            return formattedTotal;
        } catch (error) {
            console.log(error);
        }
    };

    const removeCartItem = (pid) => {
        try {
            let myCart = [...cart]
            let index = myCart.findIndex(item => item._id === pid);
            myCart.splice(index, 1);
            setCart(myCart);
            localStorage.setItem("cart", JSON.stringify(myCart))
            toast.success('Item Removed Successfully!')
        } catch (error) {
            console.log(error)
        }
    }

    const getToken = async () => {
        try {
            const { data } = await axios.get(`${API_URL}/api/v1/product/braintree/token`)
            setClientToken(data?.clientToken)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getToken()
    }, [auth?.token])

    const handlePayment = async () => {
        try {
            setLoading(true)
            const { nonce } = await instanse.requestPaymentMethod()
            const { data } = await axios.post(`${API_URL}/api/v1/product/braintree/payment`, {
                nonce, cart
            })
            setLoading(false)
            setCart([])
            navigate('/dashboard/user/orders')
            toast.success('Payment Completed Successfully')
        } catch (error) {
            console.log(error)
            setLoading(false)
        }
    }

    return (
        <Layout title={"Cart"}>
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        <h1 className='text-center bg-light p-2 mb-1'>
                            {`Hello ${auth?.token && auth?.user?.name}`}
                        </h1>
                        <h4 className='text-center mb-4'>
                            {cart?.length >= 1
                                ? `You have ${cart.length} items in your cart, ${auth?.token ? " " : "Please login to checkout"}`
                                : "Your cart is empty"}
                        </h4>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-8">
                        <div className="row">
                            <div className="d-flex flex-wrap fade-in justify-content-center">
                                {
                                    cart?.map((p, index) => (
                                        <div className="card mb-3 d-flex justify-content-center" style={{ paddingLeft: 0 }} key={index}>
                                            <div className="row">
                                                <div className="col-md-3 d-flex align-items-center justify-content-center">
                                                    <img src={p.photo} className="img-fluid rounded-start" alt={p.name} />
                                                </div>
                                                <div className="col-md-9">
                                                    <div className="card-body mt-3">
                                                        <p style={{ margin: 0, fontWeight: 'bold' }}>{p.name}</p>
                                                        <p className='product-description'>{p.description}</p>
                                                        <p style={{ margin: 0, color: 'orange' }}>Price: ₹{p.price}</p>
                                                        <button
                                                            className='btn btn-danger'
                                                            onClick={() => removeCartItem(p._id)}
                                                        >
                                                            Remove
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4 text-center">
                        <h2>Cart Summary</h2>
                        <p>Total | Checkout | Payment</p>
                        <hr />
                        <h4>Total : {totalPrice()}</h4>
                        {auth?.user?.address ? (
                            <>
                                <div className="mb">
                                    <h5>Current Address</h5>
                                    <h6>{auth?.user?.address}</h6>
                                    <button
                                        className='btn btn-outline-warning'
                                        onClick={() => navigate('/dashboard/user/profile')}
                                    >
                                        Update Address
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="mb-3">
                                {auth?.token ? (
                                    <button
                                        className='btn btn-outline-warning'
                                        onClick={() => navigate('/dashboard/user/profile')}
                                    >
                                        Update Address
                                    </button>
                                ) : (
                                    <button
                                        className='btn btn-outline-warning'
                                        onClick={() => navigate('/login', {
                                            state: '/cart'
                                        })}
                                    >
                                        Please Login To Checkout
                                    </button>
                                )}
                            </div>
                        )}
                        <div className="mt-2">
                            {
                                !clientToken || !cart?.length ? ("") : (
                                    <>
                                        <DropIn
                                            options={{
                                                authorization: clientToken,
                                                paypal: false,
                                            }}
                                            onInstance={(instance) => setInstance(instance)}
                                        />
                                        <button
                                            className='btn btn-primary'
                                            onClick={handlePayment}
                                            disabled={loading || !instanse || !auth?.user?.address}
                                        >
                                            {loading ? "Processing ...." : "Make Payment"}
                                        </button>
                                    </>
                                )
                            }
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default CartPage
