import axios from 'axios';
import { getToken } from './auth'; // Assume there's an auth module to get the token

// Create an Axios instance with default configurations
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api', // Default base URL
  timeout: 10000, // Request timeout
  withCredentials: true, // Include cookies in every requests
});

export default axiosInstance;

// // Add a request interceptor to include the auth token in headers
// axiosInstance.interceptors.request.use(async (config) => {
//   const token = await getToken(); // Get the auth token
//   if (token) {  // If token exists, add it to the headers
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// }, (error) => {
//   return Promise.reject(error);
// });
