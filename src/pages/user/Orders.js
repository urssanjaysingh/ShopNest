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
            <div className="container-fluid p-3 m-3">
                <div className="row">
                    <div className="col-md-3">
                        <UserMenu />
                    </div>
                    <div className="col-md-9">
                        <h1 className='text-center'>All Orders</h1>
                        {
                            orders?.map((o, i) => {
                                return (
                                    <div className="border">
                                        <table className="table">
                                            <thead>
                                                <th scope='col'>#</th>
                                                <th scope='col'>Status</th>
                                                <th scope='col'>Buyer</th>
                                                <th scope='col'>Date</th>
                                                <th scope='col'>Payment</th>
                                                <th scope='col'>Quantity</th>
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
                                        <div className="container">
                                            <div className="row">
                                                {
                                                    o?.products.map((p, i) => (
                                                        <div className="row mb-2 p-3 flex-row">
                                                            <div className="col-md-4" style={{ width: '10rem' }}>
                                                                <img src={p.photo} className="card-img-top img-fluid" alt={p.name} />
                                                            </div>
                                                            <div className="col-md-8">
                                                                <p>{p.name}</p>
                                                                <p>{p.description.substring(0, 30)}</p>
                                                                <p>Price : {p.price}</p>

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
