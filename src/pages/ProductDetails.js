import React, { useState, useEffect } from 'react'
import Layout from '../components/Layout/Layout'
import axios from 'axios'
import API_URL from '../api/apiConfig'
import { useParams } from 'react-router-dom'

const ProductDetails = () => {
    const params = useParams()
    const [product, setProduct] = useState({})

    useEffect(() => {
        if (params?.slug) getProduct()
        //eslint-disable-next-line
    }, [params?.slug])

    const getProduct = async () => {
        try {
            const { data } = await axios.get(`${API_URL}/api/v1/product/get/${params.slug}`)
            setProduct(data?.product)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <Layout>
            <div className="container">
                <div className="row product">
                    <div className="col-md-5 col-md-offset-0">
                        <img
                            src={product.photo}
                            className="product-image"
                            alt={product.name}
                        />
                    </div>
                    <div className="col-md-7">
                        <h1 className='product-title text-center'>Product Details</h1>
                        <hr />
                        <h2>{product.name}</h2>
                        <p className="product-description">{product.description}</p>
                        <h3 className="product-price">Price: $ {product.price}</h3>
                        <button className="btn btn-primary product-button" type="button">Add to cart</button>
                        <hr />
                        <div className="row">
                            <h1 className='product-title text-center'>Similar Products</h1>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default ProductDetails
