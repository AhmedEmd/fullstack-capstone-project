import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { urlConfig } from '../../config';
import './SearchPage.css';

function SearchPage() {
    const [searchId, setSearchId] = useState('');
    const [searchResult, setSearchResult] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSearch = useCallback(async (e) => {
        e.preventDefault();
        setError(null);
        setSearchResult(null);

        if (!searchId.trim()) {
            setError("Please enter a valid ID");
            return;
        }

        setIsLoading(true);
        try {
            const url = `${urlConfig.backendUrl}/api/gifts/${encodeURIComponent(searchId)}`;
            const response = await fetch(url);

            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error("Gift not found. Please try a different ID.");
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setSearchResult(data);
        } catch (error) {
            console.error("Error searching gift:", error);
            setError(error.message || "An error occurred while searching. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }, [searchId]);

    return (
        <div className="container mt-4">
            <h1 className="mb-4">Search Gifts</h1>
            <form onSubmit={handleSearch}>
                <div className="mb-3">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search by ID"
                        value={searchId}
                        onChange={(e) => setSearchId(e.target.value)}
                    />
                </div>
                <button className="btn btn-primary" type="submit" disabled={isLoading}>
                    {isLoading ? 'Searching...' : 'Search'}
                </button>
            </form>
            {error && <div className="alert alert-warning mt-3">{error}</div>}
            {isLoading && <div className="mt-3">Loading...</div>}
            {searchResult && !isLoading && (
                <div className="row mt-4">
                    <div className="col-md-4 mb-4">
                        <div className="card h-100">
                            <div className="card-img-container">
                                <img 
                                    src={`${process.env.PUBLIC_URL}${searchResult.image}`} 
                                    className="card-img-top" 
                                    alt={searchResult.name}
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = `${process.env.PUBLIC_URL}/images/placeholder.jpg`;
                                    }}
                                />
                            </div>
                            <div className="card-body">
                                <h5 className="card-title">{searchResult.name}</h5>
                                <p className="card-text">{searchResult.description}</p>
                                <p className="card-text"><small className="text-muted">Category: {searchResult.category}</small></p>
                                <p className="card-text"><small className="text-muted">Condition: {searchResult.condition}</small></p>
                                <button className="btn btn-primary" onClick={() => navigate(`/details/${searchResult._id}`)}>View Details</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default SearchPage;
