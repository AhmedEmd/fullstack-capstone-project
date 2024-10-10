import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { urlConfig } from '../../config';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import './MainPage.css';

export default function MainPage() {
    const [gifts, setGifts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchId, setSearchId] = useState('');
    const [searchResult, setSearchResult] = useState(null);
    const navigate = useNavigate();

    const fetchGifts = useCallback(async (token) => {
        setIsLoading(true);
        try {
            const response = await fetch(`${urlConfig.backendUrl}/api/gifts`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) {
                if (response.status === 401) {
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
    }, [navigate]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            fetchGifts(token);
        } else {
            navigate('/login');
        }
    }, [fetchGifts, navigate]);

    const handleSearch = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        if (!searchId.trim()) {
            setError('Please enter a Gift ID to search');
            return;
        }

        setIsLoading(true);
        setError(null);
        setSearchResult(null);

        try {
            const response = await fetch(`${urlConfig.backendUrl}/api/gifts/${searchId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) {
                if (response.status === 404) {
                    setError('Gift not found');
                } else {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
            } else {
                const data = await response.json();
                setSearchResult(data);
            }
        } catch (e) {
            setError('Failed to search gift. Please try again later.');
            console.error('Error searching gift:', e);
        } finally {
            setIsLoading(false);
        }
    };

    const renderGiftCard = (gift) => (
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
                <Link to={`/details/${gift._id}`} className="btn btn-primary mt-auto">
                    View Details
                </Link>
            </Card.Body>
        </Card>
    );

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <Container className="mt-4">
            <h1 className="mb-4">Gift Search</h1>
            
            <Form onSubmit={handleSearch} className="mb-4">
                <Form.Group as={Row} className="mb-3">
                    <Col sm={8}>
                        <Form.Control
                            type="text"
                            placeholder="Search by Gift ID"
                            value={searchId}
                            onChange={(e) => setSearchId(e.target.value)}
                        />
                    </Col>
                    <Col sm={4}>
                        <Button type="submit" variant="primary">Search</Button>
                    </Col>
                </Form.Group>
            </Form>

            {error && <Alert variant="danger">{error}</Alert>}

            {searchResult ? (
                <Row>
                    <Col>
                        {renderGiftCard(searchResult)}
                    </Col>
                </Row>
            ) : (
                <>
                    <h2 className="mb-4">All Gifts</h2>
                    <Row>
                        {gifts.map((gift) => (
                            <Col key={gift._id} xs={12} sm={6} md={4} className="mb-4">
                                {renderGiftCard(gift)}
                            </Col>
                        ))}
                    </Row>
                </>
            )}
        </Container>
    );
}
