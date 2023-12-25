// axios.js

import axios from 'axios';

const axiosInstance = axios.create({
 // baseURL: 'http://192.168.1.3', // replace this with your API base URL
   baseURL: process.env.VUE_APP_BASE_API,
  // Other configurations...
});

export { axiosInstance as axios };
