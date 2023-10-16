import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout/Layout';
import AdminMenu from '../../components/Layout/AdminMenu';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import API_URL from '../../api/apiConfig';
import { useNavigate, useParams } from 'react-router-dom';
import { Modal } from 'antd';
import { Select } from 'antd';
const { Option } = Select;

const UpdateProduct = () => {
    const navigate = useNavigate()
    const params = useParams()

    const [categories, setCategories] = useState([])

    const [photo, setPhoto] = useState('')
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [price, setPrice] = useState('')
    const [category, setCategory] = useState('')
    const [quantity, setQuantity] = useState('')
    const [shipping, setShipping] = useState('')
    const [id, setId] = useState('')
    const [existingPhoto, setExistingPhoto] = useState('');

    const [loading, setLoading] = useState(false);

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);

    const getSingleProduct = async () => {
        try {
            const { data } = await axios.get(`${API_URL}/api/v1/product/get/${params.slug}`)
            setId(data.product._id)
            setName(data.product.name);
            setDescription(data.product.description);
            setPrice(data.product.price);
            setQuantity(data.product.quantity);
            setShipping(data.product.shipping);
            setCategory(data.product.category._id);
            setExistingPhoto(data.product.photo);
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getSingleProduct()
        //eslint-disable-next-line
    }, [])

    //get all categories
    const getAllCategory = async () => {
        try {
            const { data } = await axios.get(`${API_URL}/api/v1/category/get-all`)
            if (data?.success) {
                setCategories(data?.category)
            }
        } catch (error) {
            console.log(error)
            toast.error('Something went wrong while getting categories')
        }
    }

    useEffect(() => {
        getAllCategory();
    }, [])

    const handleUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const productData = new FormData();
            productData.append('name', name);
            productData.append('description', description);
            productData.append('price', price);
            productData.append('category', category);
            productData.append('quantity', quantity);
            photo && productData.append('photo', photo);
            productData.append('shipping', shipping);

            const { data } = await axios.put(`${API_URL}/api/v1/product/update/${id}`, productData);

            if (data?.success) {
                toast.success('Product Updated Successfully');
                navigate('/dashboard/admin/products');
            } else {
                toast.error(data?.message);
            }
        } catch (error) {
            console.log(error);
            toast.error('Something went wrong');
        } finally {
            setLoading(false);
        }
    }

    const showDeleteModal = (target) => {
        setDeleteTarget(target);
        setIsDeleteModalOpen(true);
    };

    const hideDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setDeleteTarget(null);
    };

    const handleDeleteConfirm = async (confirmed) => {
        if (deleteTarget && confirmed) {
            // Perform the delete operation here
            try {
                const { data } = await axios.delete(`${API_URL}/api/v1/product/delete/${deleteTarget}`);
                if (data.success) {
                    toast.success(`Product Deleted Successfully`);
                    navigate('/dashboard/admin/products')
                } else {
                    toast.error(data.message);
                }
            } catch (error) {
                toast.error('Something went wrong');
            }
        }
        // Close the delete confirmation modal
        hideDeleteModal();
    };

    return (
        <Layout title='Dashboard - Update Product'>
            <div className="container-fluid m-3 p-d">
                <div className="row">
                    <div className="col-md-3">
                        <AdminMenu />
                    </div>
                    <div className="col-md-9">
                        <h1>Update Product</h1>
                        <div className="m-1 w-75">
                            <Select
                                className='form-control mb-3'
                                bordered={false}
                                placeholder={
                                    <span style={{ color: "#777" }}>Select a category</span>
                                }
                                size='large'
                                showSearch
                                onChange={(value) => { setCategory(value) }}
                                value={category}
                            >
                                {categories?.map(c => (
                                    <Option key={c._id} value={c._id}>
                                        {c.name}
                                    </Option>
                                ))}
                            </Select>
                            <div className="mb-3">
                                <label style={{ borderColor: "#ccc" }} className='btn btn-outline-secondary col-md-12'>
                                    {photo ? photo.name : "Upload Photo"}
                                    <input
                                        type="file"
                                        name="photo"
                                        accept='image/*'
                                        onChange={(e) => setPhoto(e.target.files[0])}
                                        hidden
                                    />
                                </label>
                            </div>
                            <div className="mb-3">
                                {photo ? (
                                    <div className="text-center">
                                        <img
                                            src={URL.createObjectURL(photo)}
                                            alt="product_photo"
                                            height={"200px"}
                                            className='img img-responsive'
                                        />
                                    </div>
                                ) : (
                                    <div className="text-center">
                                        <img
                                            src={existingPhoto}
                                            alt="product_photo"
                                            height={"200px"}
                                            className='img img-responsive'
                                        />
                                    </div>
                                )}
                            </div>
                            <div className="mb-3">
                                <input
                                    type="text"
                                    value={name}
                                    placeholder='Product Name'
                                    className='form-control'
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                            <div className="mb-3">
                                <textarea
                                    className="form-control mb-3"
                                    placeholder="Product Description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <input
                                    type="number"
                                    className="form-control mb-3"
                                    placeholder="Price"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <input
                                    type="number"
                                    className="form-control mb-3"
                                    placeholder="Quantity"
                                    value={quantity}
                                    onChange={(e) => setQuantity(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <Select
                                    bordered={false}
                                    placeholder={
                                        <span style={{ color: "#777" }}>Select Shipping</span>
                                    }
                                    size="large"
                                    className='form-control mb-3'
                                    onChange={(value) => {
                                        setShipping(value);
                                    }}
                                    value={shipping ? "Yes" : "No"}
                                >
                                    <Option value="0">No</Option>
                                    <Option value="1">Yes</Option>
                                </Select>
                            </div>
                            <div className="mb-3">
                                {loading ? (
                                    <div className="mb-3">
                                        <button className='btn btn-primary' disabled>
                                            Updating...
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <button className='btn btn-primary ms-2' onClick={handleUpdate}>
                                            Update Product
                                        </button>
                                        <button className='btn btn-danger ms-2' onClick={() => showDeleteModal(id)}>
                                            Delete Product
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                        <Modal
                            title="Confirm Delete"
                            open={isDeleteModalOpen}
                            footer={[
                                <button key="no" className="btn btn-primary ms-2" onClick={() => handleDeleteConfirm(false)}>
                                    No
                                </button>,
                                <button key="yes" className="btn btn-danger ms-2" onClick={() => handleDeleteConfirm(true)}>
                                    Yes
                                </button>,
                            ]}
                            onCancel={hideDeleteModal}
                        >
                            Are you sure you want to delete this category?
                        </Modal>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default UpdateProduct