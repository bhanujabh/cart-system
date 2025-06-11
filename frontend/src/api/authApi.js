import axios from "axios";

const authAPI = axios.create({
    baseURL: 'http://localhost:3005/api/auth'
});

export const register = (email, password) => authAPI.post('/register', email, password);
export const login = (email, password) => authAPI.post('/login', email, password);