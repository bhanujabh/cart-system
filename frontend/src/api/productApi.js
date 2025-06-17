import axios from "axios";

const productAPI = axios.create({
  baseURL: 'http://localhost:3007/api/product',
});

export const getAllProducts = () => productAPI.get('/');
export const getProductById = (id) => productAPI.get(`/${id}`);