import React, { useState, useEffect } from 'react'
import Layout from '../components/Layout/Layout'
import axios from 'axios'
import API_URL from '../api/apiConfig.js';
import { useParams, useNavigate } from 'react-router-dom'

const CategoryProduct = () => {
    const params = useParams()
    const navigate = useNavigate()

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
                                            <h5 className="card-title">{p.name}</h5>
                                            <p className="card-text">{p.description.substring(0, 30)}</p>
                                            <p className="card-text">$ {p.price}</p>
                                            <button
                                                className="btn btn-primary ms-1"
                                                onClick={() => navigate(`/product/${p.slug}`)}
                                            >
                                                More Details
                                            </button>
                                            <button className="btn btn-secondary ms-1">Add to Cart</button>
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
