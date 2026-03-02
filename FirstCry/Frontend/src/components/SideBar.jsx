import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, ListTree, Users, LogOut } from 'lucide-react';
import api from '../api/axios';

const Sidebar = () => {
    const navigate = useNavigate();


    const handleLogout = async () => {
    try {
        await api.get('/users/logout');
        localStorage.removeItem("user"); // CRITICAL: Clear the saved user
        navigate('/login');
    } catch (err) {
        console.error("Logout failed", err);
    }
};

    const menuItems = [
        { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
        { name: 'Products', path: '/dashboard/products', icon: <ShoppingBag size={20} /> },
        { name: 'Categories', path: '/dashboard/categories', icon: <ListTree size={20} /> },
        { name: 'Users', path: '/dashboard/users', icon: <Users size={20} /> },
    ];

    return (
        <aside className="w-64 min-h-screen bg-brand-dark text-white flex flex-col">
            <div className="p-6 text-2xl font-bold italic border-b border-gray-700">
                First<span className="text-brand-orange">Cry</span> Admin
            </div>

            <nav className="flex-1 mt-6 px-4 space-y-2">
                {menuItems.map((item) => (
                    <NavLink
                        key={item.name}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center gap-3 p-3 rounded-lg transition-colors ${
                                isActive ? 'bg-brand-orange text-white' : 'hover:bg-gray-700 text-gray-300'
                            }`
                        }
                    >
                        {item.icon}
                        <span>{item.name}</span>
                    </NavLink>
                ))}
            </nav>

            <button 
                onClick={handleLogout}
                className="m-4 flex items-center gap-3 p-3 text-gray-300 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-all"
            >
                <LogOut size={20} />
                <span>Logout</span>
            </button>
        </aside>
    );
};

export default Sidebar;