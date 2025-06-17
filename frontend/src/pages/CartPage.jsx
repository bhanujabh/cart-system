import React, { useContext, useEffect, useState } from 'react';
import { getCart, removeFromCart } from '../api/cartApi';
import { AuthContext } from '../contexts/AuthContext';

const CartPage = () => {
  const { user } = useContext(AuthContext);
  const userId = user?.id;
  const [cart, setCart] = useState([]);

  const fetchCart = () => {
    getCart(userId).then(res => setCart(res.data.CartItems || [])).catch(console.error);
  };

  useEffect(fetchCart, []);

  const handleRemove = async (itemId) => {
    await removeFromCart(itemId);
    fetchCart();
  };

  return (
    <div>
      <h2>My Cart</h2>
      {cart.map(item => (
        <div key={item.id}>
          <p>Product: {item.productId}</p>
          <p>Qty: {item.quantity}</p>
          <p>Price: {item.price}</p>
          <button onClick={() => handleRemove(item.id)}>Remove</button>
        </div>
      ))}
    </div>
  );
};

export default CartPage;
