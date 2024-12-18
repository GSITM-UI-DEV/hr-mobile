// src/app/api/axiosInstance.ts
import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL,
  timeout: 5000, // 타임아웃 설정,
  // headers: { 'content-type': 'application/x-www-form-urlencoded;charset=UTF-8' },
  // responseType: "json",
  withCredentials: true
});

axiosInstance.interceptors.request.use(
  (config) => {
    config.data = config.data || {};
    // config.url = import.meta.env.VITE_APP_API_URL + config.url!;
    return config;
  },
  (error) => {
    console.error(error);
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    // window.debug && console.log(`${response.config.url}: `, response);
    // console.log(`${response.config.url}: `, response);
    
    if (response.data.resultCode === 'F' && response.data.resultMessage === '토큰 기간 만료' ) {
      window.location.href = '/login';
    }
    return response;
  },
  (error) => {
    // console.error('axios error', error);
    return Promise.reject(error);
  }
)