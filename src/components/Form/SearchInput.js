import React from 'react'
import { useSearch } from '../../context/search'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import API_URL from '../../api/apiConfig'

const SearchInput = () => {
    const [values, setValues] = useSearch()
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (values.keyword.trim() === '') {
            // Handle empty search input here (e.g., show a message).
            return;
        }

        try {
            const { data } = await axios.get(`${API_URL}/api/v1/product/search/${values.keyword}`);
            setValues({ ...values, results: data });
            navigate('/search');
        } catch (error) {
            console.log(error);
        }
    };

    const handleInputChange = (e) => {
        setValues({ ...values, keyword: e.target.value });
    };

    return (
        <div>
            <form className="d-flex" role="search" onSubmit={handleSubmit}>
                <div className="input-group">
                    <input
                        className="form-control form-control-sm border-0"
                        type="search"
                        placeholder="Search"
                        aria-label="Search"
                        value={values.keyword}
                        onChange={handleInputChange}
                    />
                    <div className="input-group-append">
                        <button className="btn btn-sm btn-primary ms-2" type="submit">
                            <i className="fas fa-search"></i>
                        </button>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default SearchInput
