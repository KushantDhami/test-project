import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export const useAuth = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const login = async (formData) => {
        setLoading(true);
        setError('');
        try {
            const res = await api.post('/users/login', formData);
            if (res.data.success) {
                localStorage.setItem("user", JSON.stringify(res.data.user));
                const role = res.data.user.role;
                role === 'admin' ? navigate('/dashboard') : navigate('/home');
            }
        } catch (err) {
            setError(err.response?.data?.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return { login, loading, error };
};