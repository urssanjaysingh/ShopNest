import React from 'react'
import Layout from '../components/Layout/Layout'
import { useSearch } from '../context/search'
import { useCart } from '../context/cart'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const Search = () => {
    const [cart, setCart] = useCart()
    const [values, setValues] = useSearch()
    const navigate = useNavigate()

    return (
        <Layout title={'Search Results'}>
            <div className="container">
                <div className="text-center">
                    <h1>Search Results</h1>
                    <h6>
                        {values?.results.length < 1
                            ? 'No Products Found'
                            : `Found ${values?.results.length}`}
                    </h6>
                    <div className="d-flex flex-wrap mt-4">
                        {values?.results.map(p => (
                            <div className="card m-2" style={{ width: '18rem' }}>
                                <img src={p.photo} className="card-img-top" alt={p.name} />
                                <div className="card-body">
                                    <div className="product-info d-flex align-items-center justify-content-between">
                                        <h5 className="card-title mb-0">{p.name}</h5>
                                        <p className="product-price mb-0 ml-2">₹{p.price}</p>
                                    </div>
                                    <p className="card-text">{p.description.substring(0, 30)}</p>
                                    <button
                                        className="btn btn-info ms-2"
                                        onClick={() => navigate(`/product/${p.slug}`)}
                                    >
                                        More Details
                                    </button>
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
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default Search
