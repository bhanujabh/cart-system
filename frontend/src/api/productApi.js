import axios from "axios";

const productAPI = axios.create({
  baseURL: 'http://localhost:3003/api/inventory',
});

export const upsertInventory = (data) => productAPI.post('/upsert', data);
export const decreaseInventory = (data) => productAPI.post('/decrease', data);
export const getInventory = (productId) => productAPI.get(`/${productId}`);
