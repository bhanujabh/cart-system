import axios from "axios";

const cartAPI = axios.create({
  baseURL: 'http://localhost:3001/api/cart',
});

export const addToCart = (item) => cartAPI.post('/add', item);
export const getCart = (userId) => cartAPI.get(`/${userId}`);
export const removeFromCart = (itemId) => cartAPI.delete(`/remove/${itemId}`);
export const requestNotification = (item) => cartAPI.post('/request-notification', item);
