import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { urlConfig } from '../../config';
import './DetailsPage.css';
import userAvatar from './user-avatar.png'; // Update this import to the correct path

function DetailsPage() {
    const { id } = useParams();
    const [gift, setGift] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            fetchGiftDetails(token);
        } else {
            navigate('/login');
        }
    }, [id, navigate, fetchGiftDetails]); // Add fetchGiftDetails to the dependency array

    const fetchGiftDetails = React.useCallback(async (token) => {
        setLoading(true);
        try {
            const response = await fetch(`${urlConfig.backendUrl}/api/gifts/${id}`, {
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
            setGift(data);
            
            // Fetch comments
            const commentsResponse = await fetch(`${urlConfig.backendUrl}/api/gifts/${id}/comments`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (commentsResponse.ok) {
                const commentsData = await commentsResponse.json();
                setComments(commentsData);
            }
        } catch (e) {
            console.error("Error fetching gift details:", e);
            setError("Failed to load gift details. Please try again later.");
        } finally {
            setLoading(false);
        }
    }, [id, navigate]); // Add dependencies here

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        if (newComment.trim().length < 5) {
            setError('Comment must be at least 5 characters long');
            return;
        }

        try {
            const response = await fetch(`${urlConfig.backendUrl}/api/gifts/${id}/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ content: newComment })
            });

            const data = await response.json();

            if (response.ok) {
                setComments([...comments, data]);
                setNewComment('');
                setError('');
            } else {
                throw new Error(data.error || 'Failed to post comment');
            }
        } catch (error) {
            console.error('Error posting comment:', error);
            setError(`Failed to post comment. ${error.message}`);
        }
    };

    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error">{error}</div>;
    if (!gift) return <div className="not-found">Gift not found</div>;

    return (
        <div className="details-page">
            <h1 className="gift-title">{gift.name}</h1>
            <div className="gift-details">
                <div className="gift-image">
                    <img 
                        src={`${process.env.PUBLIC_URL}${gift.image}`}
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
            <div className="comments-section">
                <h2>Comments</h2>
                <div className="comments-list">
                    {comments.map((comment) => (
                        <div key={comment._id} className="comment">
                            <div className="comment-avatar">
                                <img src={userAvatar} alt={comment.author} />
                            </div>
                            <div className="comment-content">
                                <p className="comment-author">{comment.author}</p>
                                <p>{comment.content}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <form onSubmit={handleCommentSubmit} className="comment-form">
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Add a comment..."
                        required
                    />
                    <button type="submit">Post Comment</button>
                </form>
            </div>
        </div>
    );
}

export default DetailsPage;
