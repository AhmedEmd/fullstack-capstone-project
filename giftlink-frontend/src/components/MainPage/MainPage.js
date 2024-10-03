import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { urlConfig } from '../../config';
import './MainPage.css';

export default function MainPage() {
    const [gifts, setGifts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        fetchGifts(token);
    }, [navigate]);

    const fetchGifts = async (token) => {
        setIsLoading(true);
        try {
            const response = await fetch(`${urlConfig.backendUrl}/api/gifts`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) {
                if (response.status === 401) {
                    // Token is invalid or expired
                    localStorage.removeItem('token');
                    navigate('/login');
                    return;
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setGifts(data);
        } catch (e) {
            setError('Failed to fetch gifts. Please try again later.');
            console.error('Error fetching gifts:', e);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="container mt-4">
            <h1 className="mb-4">Available Gifts</h1>
            <div className="row">
                {gifts.map((gift) => (
                    <div key={gift._id} className="col-md-4 mb-4">
                        <div className="card h-100">
                            <img 
                                src={`${process.env.PUBLIC_URL}${gift.image}`} 
                                className="card-img-top" 
                                alt={gift.name}
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = `${process.env.PUBLIC_URL}/images/placeholder.jpg`;
                                }}
                            />
                            <div className="card-body d-flex flex-column">
                                <h5 className="card-title">{gift.name}</h5>
                                <p className="card-text">{gift.description}</p>
                                <p className="card-text"><small className="text-muted">Category: {gift.category}</small></p>
                                <p className="card-text"><small className="text-muted">Condition: {gift.condition}</small></p>
                                <Link to={`/details/${gift._id}`} className="btn btn-primary mt-auto">
                                    View Details
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
