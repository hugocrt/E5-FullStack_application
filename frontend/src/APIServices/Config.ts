// Config.ts
import axios, { InternalAxiosRequestConfig } from 'axios';

const createApiClient = (baseURL: string) => {
    const api = axios.create({
        baseURL,
        headers: {
            'Content-Type': 'application/json',
        },
    });

    api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
        const token = sessionStorage.getItem('access_token');
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    }, error => {
        return Promise.reject(error);
    });

    return api;
};

export default createApiClient;
