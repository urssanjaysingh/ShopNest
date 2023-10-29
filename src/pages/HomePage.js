import React, { useState, useEffect } from 'react'
import Layout from '../components/Layout/Layout'
import axios from 'axios'
import API_URL from '../api/apiConfig.js';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Checkbox, Radio } from 'antd'
import { Prices } from '../components/Prices';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/cart'

const HomePage = () => {
    const navigate = useNavigate()
    const [cart, setCart] = useCart()
    const [products, setProducts] = useState([])
    const [categories, setCategories] = useState([])
    const [checked, setChecked] = useState([])
    const [radio, setRadio] = useState([])
    const [loading, setLoading] = useState(false);
    const [noMatchingProducts, setNoMatchingProducts] = useState(false);
    const [total, setTotal] = useState(0)
    const [page, setPage] = useState(1)
    const [loadingMore, setLoadingMore] = useState(false);
    const [showFilters, setShowFilters] = useState(false);

    const getAllCategory = async () => {
        try {
            const { data } = await axios.get(`${API_URL}/api/v1/category/get-all`)
            if (data?.success) {
                setCategories(data?.category)
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getAllCategory();
        getTotal();
    }, [])

    const getAllProducts = async () => {
        try {
            setLoading(true)
            const { data } = await axios.get(`${API_URL}/api/v1/product/product-list/${page}`);
            setLoading(false);
            setProducts(data.products);
        } catch (error) {
            console.log(error);
            setLoading(false);
            toast.error('Something went wrong');
        } finally {
            setLoading(false);
        }
    }

    const getTotal = async () => {
        try {
            const { data } = await axios.get(`${API_URL}/api/v1/product/product-count`)
            setTotal(data?.total)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if (page === 1) return;
        loadMore();
        //eslint-disable-next-line
    }, [page])

    const loadMore = async () => {
        if (loadingMore) return;
        setLoadingMore(true);

        try {
            const { data } = await axios.get(`${API_URL}/api/v1/product/product-list/${page + 1}`);
            setLoadingMore(false);
            setProducts([...products, ...data?.products]);
            setPage(page + 1);
        } catch (error) {
            console.log(error);
            setLoadingMore(false);
        }
    };

    const handleFilter = (value, id) => {
        let all = [...checked]
        if (value) {
            all.push(id)
        } else {
            all = all.filter(c => c !== id)
        }
        setChecked(all);
    }

    useEffect(() => {
        if ((!checked || !checked.length) && !radio.length) {
            getAllProducts();
            setNoMatchingProducts(false);
        } else {
            filterProduct();
        }
        // eslint-disable-next-line
    }, [checked, radio]);

    const filterProduct = async () => {
        try {
            const { data } = await axios.post(`${API_URL}/api/v1/product/filters`, { checked, radio });

            if (data.products.length === 0) {
                setNoMatchingProducts(true);
            } else {
                setNoMatchingProducts(false);
            }

            setProducts(data.products);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Layout title={"Shopnest - Home"}>
            <div className="row">
                <section className="hero-section py-4 py-xl-5 mt-2">
                    <div className="container h-100">
                        <div className="text-white border rounded border-0 p-4 py-5">
                            <div className="row h-100">
                                <div className="col-md-10 col-xl-8 text-center d-flex d-sm-flex d-md-flex justify-content-center align-items-center mx-auto justify-content-md-start align-items-md-center justify-content-xl-center">
                                    <div>
                                        <h1 className="text-uppercase fw-bold text-white mb-3">Welcome to Shopnest</h1>
                                        <p className="mb-4">Your destination for quality products. Explore our wide range of products, find great deals, and shop with confidence at Shopnest, your online shopping paradise.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <div className='text-center'>
                    <button
                        className='btn btn-outline-primary mt-4 mb-3'
                        style={{ width: 300 }}
                        onClick={() => setShowFilters(!showFilters)}
                    >
                        {showFilters ? 'Hide Filters' : 'Show Filters'}
                    </button>
                </div>
                {showFilters && (
                    <>
                        <div className="d-flex flex-start">
                            <div className="col-md-2">
                                <h5 className="mt-4" style={{ marginTop: '75px' }}>Categories</h5>
                                {categories?.map((c, i) => (
                                    <div key={i}>
                                        <div className="form-check">
                                            <Checkbox
                                                className="form-check-input custom-checkbox"
                                                id={`category-${c._id}`}
                                                checked={checked.includes(c._id)}
                                                onChange={(e) => handleFilter(e.target.checked, c._id)}
                                            />
                                            <label className="form-check-label" htmlFor={`category-${c._id}`}>{c.name}</label>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="col-md-2">
                                <h5 className="mt-4">Prices</h5>
                                <div className="radio-group">
                                    {Prices?.map((p, i) => (
                                        <div key={i} className="radio-item">
                                            <Radio
                                                value={p.array}
                                                className="custom-radio"
                                                checked={radio === p.array}
                                                onChange={(e) => setRadio(e.target.value)}
                                            >
                                                {p.name}
                                            </Radio>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="text-center">
                            <button className="btn btn-outline-danger mt-4 mb-4" onClick={() => window.location.reload()}>Reset Filters</button>
                        </div>
                    </>
                )}
                <h1 className="text-center">All Products</h1>
                <div className="col-md-12">
                    {noMatchingProducts ? (
                        <div className="text-center">No products match the selected filters.</div>
                    ) : loading ? (
                        <div className="text-center">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                            <p>Loading products...</p>
                        </div>
                    ) : products.length === 0 ? (
                        <div className="text-center">No products available.</div>
                    ) : (
                        <div className="d-flex flex-wrap fade-in justify-content-center">
                            {products?.map((p, i) => (
                                <div className="card product-card m-2 bg-light" style={{ width: '18rem' }} key={i} value={p._id}>
                                    <img src={p.photo} className="card-img-top product-image" alt={p.name} />
                                    <div className="card-body">
                                        <div className="product-info d-flex align-items-center justify-content-between">
                                            <h5 className="card-title mb-0">{p.name}</h5>
                                            <p className="product-price mb-0 ml-2">₹{p.price}</p>
                                        </div>
                                        <p className="card-text product-description">{p.description.substring(0, 30)}</p>
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
                    <div className="m-2 p-3 text-center">
                        {!noMatchingProducts && !loading && products && products.length < total && !checked.length && !radio.length && (
                            <button
                                className="btn btn-success"
                                onClick={(e) => {
                                    e.preventDefault();
                                    setPage((prevPage) => prevPage + 1);
                                    loadMore();
                                }}
                                disabled={loadingMore || products.length === total}
                            >
                                {loadingMore ? (
                                    <i className="fas fa-spinner fa-spin"></i>
                                ) : "Loadmore"}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default HomePage
