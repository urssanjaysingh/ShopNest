import React, { useState, useEffect } from 'react'
import Layout from '../../components/Layout/Layout'
import UserMenu from '../../components/Layout/UserMenu'
import axios from 'axios'
import API_URL from '../../api/apiConfig'
import { useAuth } from '../../context/auth'
import moment from 'moment'

const Orders = () => {
    const [orders, setOrders] = useState([])

    const [auth, setAuth] = useAuth()

    const getOrders = async () => {
        try {
            const { data } = await axios.get(`${API_URL}/api/v1/auth/orders`)
            setOrders(data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if (auth?.token) getOrders()
    }, [auth?.token])

    return (
        <Layout title={'Your Orders'}>
            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-3">
                        <UserMenu />
                    </div>
                    <div className="col-md-9">
                        <h1 className='text-center'>All Orders</h1>
                        {
                            orders?.map((o, i) => {
                                return (
                                    <div className="border-0 order-container" key={i}>
                                        <hr className='mb-0' />
                                        <div className="table-responsive">
                                            <table className="table table-striped">
                                                <thead className="table-header">
                                                    <tr>
                                                        <th scope='col'>#</th>
                                                        <th scope='col'>Status</th>
                                                        <th scope='col'>Buyer</th>
                                                        <th scope='col'>Date</th>
                                                        <th scope='col'>Payment</th>
                                                        <th scope='col'>Quantity</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td>{i + 1}</td>
                                                        <td>{o?.status}</td>
                                                        <td>{o?.buyer?.name}</td>
                                                        <td>{moment(o?.createdAt).fromNow()}</td>
                                                        <td>{o?.payment?.success ? "Success" : "Failed"}</td>
                                                        <td>{o?.products?.length}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                        <div className="container">
                                            <div className="row">
                                                {
                                                    o?.products.map((p, i) => (
                                                        <div className="card mb-3 border-0 bg-light d-flex justify-content-center" style={{ marginBottom: '20px' }} key={i}>
                                                            <div className="row">
                                                                <div className="col-md-3 beautify-image d-flex align-items-center justify-content-center">
                                                                    <img src={p.photo} className="img-fluid rounded-start" alt={p.name} />
                                                                </div>
                                                                <div className="col-md-9">
                                                                    <div className="card-body mt-3">
                                                                        <p style={{ margin: 0, fontWeight: 'bold' }}>{p.name}</p>
                                                                        <p className='product-description'>{p.description}</p>
                                                                        <p style={{ fontWeight: 'bold', color: 'orange' }}>Price: ₹{p.price}</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))
                                                }
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default Orders
