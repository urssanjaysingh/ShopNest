import React, { useState, useEffect } from 'react'
import AdminMenu from '../../components/Layout/AdminMenu'
import Layout from '../../components/Layout/Layout';
import axios from 'axios';
import API_URL from '../../api/apiConfig';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom'

const Products = () => {
    const [products, setProducts] = useState([])

    const getAllProducts = async () => {
        try {
            const { data } = await axios.get(`${API_URL}/api/v1/product/get-all`)
            setProducts(data.products);
        } catch (error) {
            console.log(error)
            toast.error('Something went wrong')
        }
    }

    //lifecycle method
    useEffect(() => {
        getAllProducts()
    }, [])

    return (
        <Layout>
            <div className="row">
                <div className="col-md-3">
                    <AdminMenu />
                </div>
                <div className="col-md-9">
                    <h1 className="text-center">All Products List</h1>
                    <div className="d-flex">
                        {products?.map(p => (
                            <Link key={p._id} to={`${p.slug}`} className='product-link'>
                                <div className="card" style={{ width: '18rem' }}>
                                    <img src={p.photo} className="card-img-top" alt={p.name} />
                                    <div className="card-body">
                                        <h5 className="card-title">{p.name}</h5>
                                        <p className="card-text">{p.description}</p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default Products
