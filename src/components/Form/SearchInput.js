import React from 'react'
import { useSearch } from '../../context/search'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import API_URL from '../../api/apiConfig'

const SearchInput = () => {
    const [values, setValues] = useSearch()
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const { data } = await axios.get(`${API_URL}/api/v1/product/search/${values.keyword}`)
            setValues({ ...values, results: data })
            navigate('/search')
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div>
            <form className="d-flex" role="search" onSubmit={handleSubmit}>
                <div className="input-group">
                    <input
                        className="form-control border-0"
                        type="search"
                        placeholder="Search"
                        aria-label="Search"
                        value={values.keyword}
                        onChange={(e) => setValues({ ...values, keyword: e.target.value })}
                    />
                    <div className="input-group-append">
                        <button
                            className="btn btn-primary ms-2"
                            type="submit"
                        >
                            Search
                        </button>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default SearchInput
