import axios from 'axios';

const notificationAPI = axios.create({
  baseURL: 'http://localhost:3004/api/notify',
});

export const sendNotification = (subject, text, to) =>
  notificationAPI.post('/send-email', { subject, text, to });
