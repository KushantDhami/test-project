import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { FormInput } from '../components/FormInput';

const LoginPage = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const { login, loading, error } = useAuth();

    const handleSubmit = (e) => {
        e.preventDefault();
        login(formData);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-brand-dark p-4">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-8 border border-gray-100">
                <header className="text-center mb-10">
                    <h1 className="text-4xl font-extrabold tracking-tight">
                        First<span className="text-brand-orange">Cry</span>
                    </h1>
                    <p className="text-gray-400 text-sm mt-2">Welcome back! Please enter your details.</p>
                </header>

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-xs font-medium border border-red-100 animate-pulse">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    <FormInput 
                        label="Email Address" 
                        type="email" 
                        placeholder="admin@firstcry.com"
                        onChange={(e) => setFormData({...formData, email: e.target.value})} 
                    />
                    <FormInput 
                        label="Password" 
                        type="password" 
                        placeholder="••••••••"
                        onChange={(e) => setFormData({...formData, password: e.target.value})} 
                    />

                    <button 
                        type="submit"
                        disabled={loading}
                        className="mt-2 w-full bg-brand-orange text-white font-bold py-3 rounded-lg hover:bg-orange-600 transform active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-orange-200"
                    >
                        {loading ? "Authenticating..." : "Sign In"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;