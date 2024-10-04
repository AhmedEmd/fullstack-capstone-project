import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { urlConfig } from '../../config';
import { Container, Row, Col, Card } from 'react-bootstrap';
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
        <Container className="mt-4">
            <h1 className="mb-4">Available Gifts</h1>
            <Row>
                {gifts.map((gift) => (
                    <Col key={gift._id} xs={12} sm={6} md={4} className="mb-4">
                        <Card className="h-100 gift-card">
                            <div className="card-img-container">
                                <Card.Img
                                    variant="top"
                                    src={`${process.env.PUBLIC_URL}${gift.image}`}
                                    alt={gift.name}
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = `${process.env.PUBLIC_URL}/images/placeholder.jpg`;
                                    }}
                                />
                            </div>
                            <Card.Body className="d-flex flex-column">
                                <Card.Title>{gift.name}</Card.Title>
                                <Card.Text>{gift.description}</Card.Text>
                                <Card.Text><small className="text-muted">Category: {gift.category}</small></Card.Text>
                                <Card.Text><small className="text-muted">Condition: {gift.condition}</small></Card.Text>
                                <Link to={`/details/${gift._id}`} className="btn btn-primary mt-auto">
                                    View Details
                                </Link>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
}
