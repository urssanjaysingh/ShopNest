import React, { useEffect, useState } from 'react'
import Layout from '../../components/Layout/Layout'
import AdminMenu from '../../components/Layout/AdminMenu'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import API_URL from '../../api/apiConfig';
import CategoryForm from '../../components/Form/CategoryForm';
import { Modal } from 'antd';

const CreateCategory = () => {
    const [categories, setCategories] = useState([]);
    const [name, setName] = useState('')
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selected, setSelected] = useState(null)
    const [updatedName, setUpdatedName] = useState("")
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            const { data } = await axios.post(`${API_URL}/api/v1/category/create`, { name })
            if (data?.success) {
                toast.success(`${name} is created`)
                setName('')
                getAllCategory()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error('Failed to create the category.');
        }
    }

    const handleUpdate = async (e) => {
        e.preventDefault()
        try {
            const { data } = await axios.put(`${API_URL}/api/v1/category/update/${selected._id}`, { name: updatedName })
            if (data.success) {
                toast.success(`${updatedName} is updated`)
                setSelected(null)
                setUpdatedName("")
                handleOk()
                getAllCategory()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error('Something went wrong')
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
            try {
                const { data } = await axios.delete(`${API_URL}/api/v1/category/delete/${deleteTarget._id}`);
                if (data.success) {
                    toast.success(`Category is deleted`);
                    getAllCategory();
                } else {
                    toast.error(data.message);
                }
            } catch (error) {
                toast.error('Something went wrong');
            }
        }
        hideDeleteModal();
    };

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

    return (
        <Layout title='Dashboard - Create Category'>
            <div className="container-fluid m-3 p-d">
                <div className="row">
                    <div className="col-md-3">
                        <AdminMenu />
                    </div>
                    <div className="col-md-9">
                        <h1>Manage Categories</h1>
                        <div className="p-3 w-50">
                            <CategoryForm
                                handleSubmit={handleSubmit}
                                value={name}
                                setValue={setName}
                            />
                        </div>
                        <div className='w-75'>
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th scope="col">Name</th>
                                        <th scope="col">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {categories?.map((c, i) => (
                                        <tr key={i}>
                                            <td>{c.name}</td>
                                            <td>
                                                <button
                                                    className="btn btn-primary ms-2"
                                                    onClick={() => {
                                                        showModal();
                                                        setUpdatedName(c.name);
                                                        setSelected(c);
                                                    }}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    className="btn btn-danger ms-2"
                                                    onClick={() => showDeleteModal(c)}
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <Modal
                            title="Edit Category"
                            open={isModalOpen}
                            onOk={(e) => handleUpdate(e)}
                            onCancel={handleCancel}>
                            <form onSubmit={handleUpdate}>
                                <div className="mb-3">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder='Enter new category'
                                        value={updatedName}
                                        onChange={(e) => setUpdatedName(e.target.value)}
                                        required
                                    />
                                </div>
                            </form>
                        </Modal>
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

export default CreateCategory
