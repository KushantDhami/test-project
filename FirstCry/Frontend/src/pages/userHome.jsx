import React from 'react';
import { ShoppingCart, User, Search, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const UserHome = () => {
    const navigate = useNavigate();

    
    const handleLogout = async () => {
    try {
        await api.get('/users/logout');
        localStorage.removeItem("user"); 
        navigate('/login');
    } catch (err) {
        console.error("Logout failed", err);
    }
};

    return (
        <div className="min-h-screen bg-white">
            {/* User Navbar */}
            <nav className="flex items-center justify-between px-10 py-4 shadow-sm border-b sticky top-0 bg-white z-50">
                <h1 className="text-2xl font-bold italic text-brand-dark">
                    First<span className="text-brand-orange">Cry</span>
                </h1>
                
                {/* Search Bar */}
                <div className="flex-1 max-w-md mx-10">
                    <div className="relative">
                        <input 
                            type="text" 
                            placeholder="Search for toys, diapers, clothes..." 
                            className="w-full bg-gray-100 px-4 py-2 rounded-full outline-none border focus:border-brand-orange text-sm"
                        />
                        <Search className="absolute right-3 top-2 text-gray-400" size={18} />
                    </div>
                </div>

                {/* Navigation Actions */}
                <div className="flex items-center gap-8 text-gray-600">
                    <div className="flex flex-col items-center cursor-pointer hover:text-brand-orange transition-colors">
                        <User size={20} />
                        <span className="text-xs font-medium">Profile</span>
                    </div>
                    <div className="flex flex-col items-center cursor-pointer hover:text-brand-orange transition-colors">
                        <ShoppingCart size={20} />
                        <span className="text-xs font-medium">Cart</span>
                    </div>
                    
                    {/* Logout Button */}
                    <button 
                        onClick={handleLogout}
                        className="flex flex-col items-center cursor-pointer hover:text-red-500 transition-colors border-l pl-6"
                    >
                        <LogOut size={20} />
                        <span className="text-xs font-medium">Logout</span>
                    </button>
                </div>
            </nav>

            {/* Hero Section */}
            <header className="bg-orange-50 py-16 px-10 flex justify-between items-center">
                <div className="max-w-lg">
                    <h2 className="text-4xl font-extrabold text-brand-dark leading-tight">
                        Biggest Summer Sale is <span className="text-brand-orange">LIVE!</span>
                    </h2>
                    <p className="mt-4 text-gray-600 text-lg">Get up to 50% off on premium baby brands and essentials.</p>
                    <button className="mt-8 bg-brand-orange text-white px-8 py-3 rounded-md font-bold hover:shadow-lg transform active:scale-95 transition-all">
                        Shop Now
                    </button>
                </div>
                <div className="hidden md:block">
                    <div className="w-64 h-64 bg-brand-orange/10 rounded-full flex items-center justify-center text-brand-orange font-bold border-2 border-dashed border-brand-orange">
                        Promo Banner
                    </div>
                </div>
            </header>

            {/* Popular Categories */}
            <section className="p-10">
                <h3 className="text-2xl font-bold mb-8 text-brand-dark">Popular Categories</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {['Fashion', 'Toys', 'Diapering', 'Feeding'].map(cat => (
                        <div key={cat} className="h-40 bg-white rounded-2xl flex flex-col items-center justify-center border border-gray-100 shadow-sm hover:shadow-md hover:border-brand-orange cursor-pointer transition-all group">
                            <div className="w-16 h-16 bg-gray-50 rounded-full mb-3 group-hover:bg-orange-100 transition-colors"></div>
                            <span className="font-semibold text-gray-700">{cat}</span>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default UserHome;