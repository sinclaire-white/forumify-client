
import axios from 'axios';
import { useNavigate } from 'react-router';
import { useEffect } from 'react';

const axiosSecure = axios.create({
  baseURL: 'https://forum-server-ten-khaki.vercel.app',
});

const useAxiosSecure = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const requestInterceptor = axiosSecure.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('access-token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseInterceptor = axiosSecure.interceptors.response.use(
      (response) => response,
      (error) => {
        const status = error.response?.status;
        if (status === 401) {
          localStorage.removeItem('access-token');
          navigate('/login');
        } else if (status === 403) {
          navigate('/forbidden');
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axiosSecure.interceptors.request.eject(requestInterceptor);
      axiosSecure.interceptors.response.eject(responseInterceptor);
    };
  }, [navigate]);

  return axiosSecure;
};

export default useAxiosSecure;
