import React, { useState, useEffect } from 'react'
import Layout from '../components/Layout/Layout'
import axios from 'axios'
import API_URL from '../api/apiConfig'
import { useParams, useNavigate } from 'react-router-dom'
import { useCart } from '../context/cart'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProductDetails = () => {
    const params = useParams()
    const navigate = useNavigate()
    const [cart, setCart] = useCart()
    const [product, setProduct] = useState({})
    const [relatedProducts, setRelatedProducts] = useState([])

    useEffect(() => {
        if (params?.slug) getProduct()
        //eslint-disable-next-line
    }, [params?.slug])

    const getProduct = async () => {
        try {
            const { data } = await axios.get(`${API_URL}/api/v1/product/get/${params.slug}`)
            setProduct(data?.product)
            getSimilarProduct(data?.product._id, data?.product.category._id)
        } catch (error) {
            console.log(error)
        }
    }

    const getSimilarProduct = async (pid, cid) => {
        try {
            const { data } = await axios.get(`${API_URL}/api/v1/product/related-product/${pid}/${cid}`)
            setRelatedProducts(data?.products)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <Layout>
            <div className="container">
                <div className="row product mt-4 mb-4">
                    <div className="col-md-6" style={{ width: '28rem' }} >
                        <img src={product.photo} className="img-fluid" alt={product.name} />
                    </div>
                    <div className="col-md-6 d-flex align-items-center justify-content-center">
                        <div>
                            <h2 className="main-product-title">{product.name}</h2>
                            <p className="product-description">{product.description}</p>
                            <h3 className="product-price">Price: ₹{product.price}</h3>
                            <h6 className='product-category'>Category: {product?.category?.name}</h6>
                            <button
                                className="btn ms-2 product-button"
                                onClick={() => {
                                    setCart([...cart, product])
                                    localStorage.setItem(
                                        "cart",
                                        JSON.stringify([...cart, product])
                                    );
                                    toast.success('Item Added to Cart')
                                }}
                            >
                                Add to Cart <i className="fas fa-shopping-cart me-1"></i>
                            </button>
                        </div>
                    </div>
                </div>
                <hr />
                <div className="row container">
                    <h4>Similar Products</h4>
                    {relatedProducts.length < 1 && <p className="text-center">No Similar Product Found</p>}
                    <div className="d-flex flex-wrap">
                        {relatedProducts?.map((p) => (
                            <div className="card product-card m-2" style={{ width: '18rem' }} key={p._id}>
                                <img src={p.photo} className="card-img-top product-image" alt={p.name} />
                                <div className="card-body">
                                    <div className="product-info d-flex align-items-center justify-content-between">
                                        <h5 className="card-title mb-0">{p.name}</h5>
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
                </div>
            </div>
        </Layout>
    )
}

export default ProductDetails
