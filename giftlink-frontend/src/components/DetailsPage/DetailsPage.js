import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { urlConfig } from '../../config';
import './DetailsPage.css';

function DetailsPage() {
    const { id } = useParams();
    const [gift, setGift] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchGiftDetails = async () => {
            try {
                const response = await fetch(`${urlConfig.backendUrl}/api/gifts/${id}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setGift(data);
                setLoading(false);
            } catch (e) {
                console.error("Error fetching gift details:", e);
                setError("Failed to load gift details. Please try again later.");
                setLoading(false);
            }
        };

        fetchGiftDetails();
    }, [id]);

    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error">{error}</div>;
    if (!gift) return <div className="not-found">Gift not found</div>;

    return (
        <div className="details-page">
            <h1 className="gift-title">{gift.name}</h1>
            <div className="gift-details">
                <div className="gift-image">
                    <img 
                        src={`${urlConfig.backendUrl}${gift.image}`} 
                        alt={gift.name}
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = `${process.env.PUBLIC_URL}/images/placeholder.jpg`;
                        }}
                    />
                </div>
                <div className="gift-info">
                    <p><strong>Description:</strong> {gift.description}</p>
                    <p><strong>Category:</strong> {gift.category}</p>
                    <p><strong>Condition:</strong> {gift.condition}</p>
                    <p><strong>ID:</strong> {gift._id}</p>
                </div>
            </div>
        </div>
    );
}

export default DetailsPage;
