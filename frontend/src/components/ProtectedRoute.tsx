// ProtectedRoute.tsx
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import type {JSX} from 'react'
import { Loader } from "./Loader.tsx";

const API_URL = 'http://localhost:5000/users';

interface ProtectedRouteProps {
    children: JSX.Element;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const checkAuth = async () => {
            const token = sessionStorage.getItem('access_token');
            if (!token) {
                setIsAuthenticated(false);
                setLoading(false);
                return;
            }
            try {
                await axios.get(`${API_URL}/check-auth`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setIsAuthenticated(true);
            } catch {
                setIsAuthenticated(false);
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    if (loading) {
        return <div>
            <Loader />
        </div>;
    }

    return isAuthenticated ? children : <Navigate to="/" />;
};

export default ProtectedRoute;
