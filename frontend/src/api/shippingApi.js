import axios from "axios";

const shippingAPI = axios.create({
  baseURL: 'http://localhost:3006/api/shipping',
});

export const createShipment = (data) => shippingAPI.post('/', data);
export const updateShipmentStatus = (id, status) => shippingAPI.patch(`/${id}`, { status });
export const getAllShipments = () => shippingAPI.get('/');
