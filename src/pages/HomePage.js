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

    //get all categories
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
            setLoading(false); // Set loading back to false
        }
    }

    //get total count
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
        // If no categories are selected and no price filter is selected, reload all products
        if ((!checked || !checked.length) && !radio.length) {
            getAllProducts();
            setNoMatchingProducts(false); // Hide the message
        } else {
            filterProduct();
        }
        // eslint-disable-next-line
    }, [checked, radio]);

    const filterProduct = async () => {
        try {
            const { data } = await axios.post(`${API_URL}/api/v1/product/filters`, { checked, radio });

            if (data.products.length === 0) {
                setNoMatchingProducts(true); // Show the message
            } else {
                setNoMatchingProducts(false); // Hide the message
            }

            setProducts(data.products);
        } catch (error) {
            console.log('Error while filtering products:', error);
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
                <div className="col-md-3">
                    <h5 className='text-center' style={{ marginTop: '75px' }}>Filter By Category</h5>
                    <div className="d-flex flex-column">
                        {categories?.map(c => (
                            <Checkbox key={c._id} onChange={(e) => handleFilter(e.target.checked, c._id)}>
                                {c.name}
                            </Checkbox>
                        ))}
                    </div>
                    <h5 className='text-center mt-3'>Filter By Price</h5>
                    <div className="d-flex flex-column">
                        <Radio.Group onChange={e => setRadio(e.target.value)}>
                            {Prices?.map(p => (
                                <div key={p._id}>
                                    <Radio value={p.array}>{p.name}</Radio>
                                </div>
                            ))}
                        </Radio.Group>
                    </div>
                    <div className="d-flex flex-column">
                        <button className='btn btn-danger mt-4' onClick={() => window.location.reload()}>Reset Filters</button>
                    </div>
                </div>
                <div className="col-md-9">
                    <h1 className='text-center mt-3'>All Products</h1>
                    {noMatchingProducts ? (
                        <div className="text-center">No products match the selected filters.</div>
                    ) : loading ? (
                        <div className="text-center">
                            <div className="spinner-border" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                            <p>Loading products...</p>
                        </div>
                    ) : products.length === 0 ? (
                        <div className="text-center">No products available.</div>
                    ) : (
                        <div className="d-flex flex-wrap fade-in">
                            {products?.map((p, index) => (
                                <div className="card product-card m-2 bg-light" style={{ width: '18rem' }} key={index}>
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
                    )}
                    <div className="m-2 p-3 text-center">
                        {!loading && products && products.length < total && (
                            <button
                                className="btn btn-success"
                                onClick={(e) => {
                                    e.preventDefault();
                                    setPage((prevPage) => prevPage + 1);
                                    loadMore(); // Load more products
                                }}
                                disabled={loadingMore || products.length === total}
                            >
                                {loadingMore ? "Loading ..." : "Loadmore"}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default HomePage
