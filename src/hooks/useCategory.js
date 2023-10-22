import { useState, useEffect } from 'react'
import axios from 'axios'
import API_URL from '../api/apiConfig.js';

export default function useCategory() {
    const [categories, setCategories] = useState([])

    const getCategories = async () => {
        try {
            const { data } = await axios.get(`${API_URL}/api/v1/category/get-all`)
            setCategories(data?.category)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getCategories()
    }, [])

    return categories
}
