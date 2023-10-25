import React, { useState, useEffect } from 'react'
import Layout from '../components/Layout/Layout'
import axios from 'axios'
import API_URL from '../api/apiConfig.js';
import { useParams, useNavigate } from 'react-router-dom'
import { useCart } from '../context/cart'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CategoryProduct = () => {
    const params = useParams()
    const navigate = useNavigate()
    const [cart, setCart] = useCart()
    const [products, setProducts] = useState([])
    const [category, setCategory] = useState()
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (params?.slug) getProductsByCategory()
        //eslint-disable-next-line
    }, [params?.slug])

    const getProductsByCategory = async () => {
        try {
            setLoading(true)
            const { data } = await axios.get(
                `${API_URL}/api/v1/product/product-category/${params.slug}`
            );
            setLoading(false)
            setProducts(data?.products)
            setCategory(data?.category)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <Layout>
            <div className='container mt-3'>
                <h4 className='text-center'>Category - {category?.name}</h4>
                <h6 className='text-center'>{products?.length} results found</h6>
                <div className="row">
                    <div className="offset-1">
                        {loading ? (
                            <div className="text-center">
                                <div className="spinner-border" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                                <p>Loading products...</p>
                            </div>
                        ) : products.length === 0 ? (
                            <div className="text-center">No products available.</div>
                        ) : (
                            <div className="d-flex flex-wrap">
                                {products?.map(p => (
                                    <div className="card m-2" style={{ width: '18rem' }}>
                                        <img src={p.photo} className="card-img-top" alt={p.name} />
                                        <div className="card-body">
                                            <div className="product-info d-flex align-items-center justify-content-between">
                                                <h5 className="card-title ">{p.name}</h5>
                                                <p className="product-price mb-0 ml-2">₹{p.price}</p>
                                            </div>
                                            <p className="card-text">{p.description.substring(0, 30)}</p>
                                            <button
                                                className="btn ms-2 btn-warning"
                                                onClick={() => {
                                                    setCart([...cart, p])
                                                    localStorage.setItem(
                                                        "cart",
                                                        JSON.stringify([...cart, p])
                                                    );
                                                    toast.success('Item Added to Cart')
                                                }}
                                            >
                                                Add To Cart
                                            </button>
                                            <button
                                                className="btn btn-info ms-2"
                                                onClick={() => navigate(`/product/${p.slug}`)}
                                            >
                                                More Details
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default CategoryProduct
