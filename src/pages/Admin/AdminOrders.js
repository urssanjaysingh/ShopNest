import React, { useState, useEffect } from 'react'
import axios from 'axios'
import AdminMenu from '../../components/Layout/AdminMenu'
import Layout from '../../components/Layout/Layout'
import { toast } from 'react-toastify'
import API_URL from '../../api/apiConfig'
import { useAuth } from '../../context/auth'
import moment from 'moment'
import { Select } from 'antd'

const AdminOrders = () => {
  const [status, setStatus] = useState(['Not Process', 'Processing', 'Shipped', 'Delivered', 'Canceled'])
  const [orders, setOrders] = useState([])

  const [auth, setAuth] = useAuth()

  const getOrders = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/v1/auth/all-orders`)
      setOrders(data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (auth?.token) getOrders()
  }, [auth?.token])

  const handleChange = async (orderId, value) => {
    try {
      const { data } = await axios.put(`${API_URL}/api/v1/auth/order-status/${orderId}`, {
        status: value
      })
      toast.success('Status Changed Successfully')
      if (data.status === 200) {
        getOrders();
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Layout title="All Orders Data">
      <div className='container-fluid'>
        <div className="row">
          <div className='col-md-3'>
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <h1 className='text-center mb-3'>All Orders</h1>
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
                            <td>
                              <Select
                                bordered={false}
                                onChange={(value) => handleChange(o._id, value)}
                                defaultValue={o?.status}
                                style={{ width: 120 }}
                              >
                                {status.map((s, i) => (
                                  <option key={i} value={s}>
                                    {s}
                                  </option>
                                ))}
                              </Select>
                            </td>
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
                                <div className="col-md-3 d-flex align-items-center justify-content-center">
                                  <img src={p.photo} className="img-fluid rounded-start" alt={p.name} />
                                </div>
                                <div className="col-md-9 d-flex align-items-center justify-content-center">
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

export default AdminOrders
