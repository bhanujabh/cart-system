import axios from "axios";

const orderAPI = axios.create({
  baseURL: 'http://localhost:3002/api/order',
});

export const createOrder = (orderData) => orderAPI.post('/', orderData);
export const getAllOrders = () => orderAPI.get('/');

