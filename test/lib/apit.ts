import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:3333';

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});
