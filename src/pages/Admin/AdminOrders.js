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
        getOrders(); // Refresh the orders after the update
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Layout title="All Orders Data">
      <div className='row'>
        <div className='col-md-3'>
          <AdminMenu />
        </div>
        <div className="col-md-9">
          <h1 className='text-center'>All Orders</h1>
          {
            orders?.map((o, i) => {
              return (
                <div className="border order-container">
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
                        <td>
                          <Select
                            bordered={false}
                            onChange={(value) => handleChange(o._id, value)}
                            defaultValue={o?.status}
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
                  <div className="row justify-content-center">
                    {
                      o?.products.map((p, i) => (
                        <div className="row mb-2 p-3 flex-row">
                          <div className="col-md-4" style={{ width: '10rem' }}>
                            <img src={p.photo} className="card-img-top img-fluid" alt={p.name} />
                          </div>
                          <div className="col-md-9">
                            <p>{p.name}</p>
                            <p>{p.description.substring(0, 30)}</p>
                            <p>Price : {p.price}</p>
                          </div>
                        </div>
                      ))
                    }
                  </div>
                </div>
              )
            })
          }
        </div>
      </div>
    </Layout>
  )
}

export default AdminOrders
