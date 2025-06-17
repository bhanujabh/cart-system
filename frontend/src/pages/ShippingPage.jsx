import React, { useEffect, useState } from 'react';
import { getAllShipments } from '../api/shippingAPI';

const ShippingPage = () => {
  const [shipments, setShipments] = useState([]);

  useEffect(() => {
    getAllShipments().then(res => setShipments(res.data)).catch(console.error);
  }, []);

  return (
    <div>
      <h2>Shipping Status</h2>
      {shipments.map(sh => (
        <div key={sh.id}>
          <p>Order: {sh.orderId}</p>
          <p>Status: {sh.status}</p>
        </div>
      ))}
    </div>
  );
};

export default ShippingPage;
