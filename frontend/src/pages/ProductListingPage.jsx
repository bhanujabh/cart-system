import React, { useEffect, useState } from 'react';
import { getAllProducts } from '../api/productApi';

const ProductListingPage = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getAllProducts().then(res => setProducts(res.data)).catch(console.error);
  }, []);

  return (
    <div>
      <h2>Products</h2>
      {products.map(prod => (
        <div key={prod.id}>
          <h4>{prod.name}</h4>
          <p>Price: {prod.price}</p>
          <p>Stock: {prod.quantity}</p>
        </div>
      ))}
    </div>
  );
};

export default ProductListingPage;
