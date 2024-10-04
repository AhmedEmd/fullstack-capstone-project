import React, { useState } from 'react';
import axios from 'axios';

function GiftSearch() {
  const [id, setId] = useState('');
  const [gift, setGift] = useState(null);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(`http://localhost:5000/search?id=${id}`);
      if (response.data.length > 0) {
        setGift(response.data[0]);
        setError('');
      } else {
        setGift(null);
        setError('No gift found with this ID');
      }
    } catch (err) {
      setGift(null);
      setError('Error searching for gift');
    }
  };

  return (
    <div>
      <h2>Search for a Gift</h2>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={id}
          onChange={(e) => setId(e.target.value)}
          placeholder="Enter gift ID"
        />
        <button type="submit">Search</button>
      </form>
      {error && <p>{error}</p>}
      {gift && (
        <div>
          <h3>{gift.name}</h3>
          <p>{gift.description}</p>
          <p>Price: ${gift.price}</p>
        </div>
      )}
    </div>
  );
}

export default GiftSearch;