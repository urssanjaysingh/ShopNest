import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Spin } from 'antd';

const Spinner = ({ path = 'login' }) => {
    const [count, setCount] = useState(5)
    const navigate = useNavigate()
    const location = useLocation()

    useEffect(() => {
        // Implement your countdown logic here and update the 'count' state
        const countdownTimer = setInterval(() => {
            setCount((prevCount) => prevCount - 1);
        }, 1000);

        // When count reaches 0, navigate to the specified path
        if (count === 0) {
            navigate(`/${path}`, {
                state: location.pathname,
            });
        }

        return () => {
            clearInterval(countdownTimer);
        };
    }, [count, navigate, path, location]);

    return (
        <div className="d-flex flex-column justify-content-center align-items-center" style={{ height: "100vh" }}>
            <h1 className="text-center">Redirecting to you in {count} second{count !== 1 ? 's' : ''}</h1>
            {count !== 0 ? <Spin size="large" /> : null}
        </div>
    );
}

export default Spinner