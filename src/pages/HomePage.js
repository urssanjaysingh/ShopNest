import React, { useState, useEffect } from 'react'
import Layout from '../components/Layout/Layout'
import axios from 'axios'
import API_URL from '../api/apiConfig.js';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Checkbox, Radio } from 'antd'
import { Prices } from '../components/Prices';

const HomePage = () => {
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
        try {
            setLoadingMore(true); // Set loadingMore to true
            const { data } = await axios.get(`${API_URL}/api/v1/product/product-list/${page}`);
            setLoadingMore(false); // Set loadingMore back to false
            setProducts([...products, ...data?.products])
        } catch (error) {
            console.log(error);
            setLoadingMore(false); // Set loadingMore back to false
        }
    }

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
                <div className="col-md-3">
                    <h6 className='text-center'>Filter By Category</h6>
                    <div className="d-flex flex-column">
                        {categories?.map(c => (
                            <Checkbox key={c._id} onChange={(e) => handleFilter(e.target.checked, c._id)}>
                                {c.name}
                            </Checkbox>
                        ))}
                    </div>
                    <h6 className='text-center mt-4'>Filter By Price</h6>
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
                    <h1 className='text-center'>All Products</h1>
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
                        <div className="d-flex flex-wrap">
                            {products?.map(p => (
                                <div className="card m-2" style={{ width: '18rem' }}>
                                    <img src={p.photo} className="card-img-top" alt={p.name} />
                                    <div className="card-body">
                                        <h5 className="card-title">{p.name}</h5>
                                        <p className="card-text">{p.description.substring(0, 30)}</p>
                                        <p className="card-text">$ {p.price}</p>
                                        <button className="btn btn-primary ms-1">More Details</button>
                                        <button className="btn btn-secondary ms-1">Add to Cart</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    <div className="m-2 p-3">
                        {products && products.length < total && (
                            <button
                                className="btn btn-info"
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
