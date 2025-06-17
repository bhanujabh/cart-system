import React, { useContext } from 'react';
import { createOrder } from '../api/orderAPI';
import { AuthContext } from '../contexts/AuthContext';

const CheckoutPage = () => {
  const { user } = useContext(AuthContext);
  const userId = user?.id;

  const handleCheckout = async () => {
    try {
      await createOrder({ userId });
      alert('Order placed successfully!');
    } catch (err) {
      alert('Checkout failed: ' + err.message);
    }
  };

  return (
    <div>
      <h2>Checkout</h2>
      <button onClick={handleCheckout}>Place Order</button>
    </div>
  );
};

export default CheckoutPage;
