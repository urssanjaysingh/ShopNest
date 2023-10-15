import React, { useEffect, useState } from 'react'
import Layout from '../../components/Layout/Layout'
import AdminMenu from '../../components/Layout/AdminMenu'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import API_URL from '../../api/apiConfig';
import CategoryForm from '../../components/Form/CategoryForm';

const CreateCategory = () => {
    const [categories, setCategories] = useState([]);
    const [name, setName] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            const { data } = await axios.post(`${API_URL}/api/v1/category/create`, { name })
            if (data?.success) {
                toast.success(`${name} is created`)
                getAllCategory()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error('Failed to create the category.');
        }
    }

    //get all categories
    const getAllCategory = async () => {
        try {
            const { data } = await axios.get(`${API_URL}/api/v1/category/get-all`)
            if (data.success) {
                setCategories(data.category)
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
                                    {categories?.map((c) => (
                                        <tr key={c._id}>
                                            <td>{c.name}</td>
                                            <td><button className="btn btn-primary">Edit</button></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default CreateCategory
