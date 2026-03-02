import React, { useEffect, useState } from 'react';
import { Edit, Trash2, Plus, PackageOpen, Loader2, Star, Images, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ProductTable = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchProducts = async () => {
        try {
            const res = await axios.get('http://localhost:3000/api/product/all', {
                withCredentials: true 
            });
            if (res.data.success) {
                setProducts(res.data.products || []);
            }
        } catch (err) {
            setError("Failed to load inventory.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this product?")) return;
        try {
            const res = await axios.delete(`http://localhost:3000/api/product/delete/${id}`, {
                withCredentials: true
            });

            if (res.data.success) {
                setProducts(prev => prev.filter(p => p._id !== id));
                alert("Product Deleted");
            }
        } catch (err) {
            console.error(err);
            alert(`Delete failed: ${err.response?.data?.message || "Server Error"}`);
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center p-20 text-gray-400 font-medium">
            <Loader2 className="animate-spin mb-2" size={32} />
            <p>Syncing Inventory...</p>
        </div>
    );

    if (error) return <div className="text-center p-20 text-red-500 font-bold">{error}</div>;

    return (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 m-4 overflow-hidden">
            {/* Header */}
            <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-white">
                <div>
                    <h2 className="text-2xl font-black text-gray-800 tracking-tight">Products</h2>
                    <p className="text-sm text-gray-400">Total {products.length} items available</p>
                </div>
                <Link to="/dashboard/products/add">
                    <button className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100">
                        <Plus size={20} /> Add Product
                    </button>
                </Link>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50/50 text-gray-400 text-[10px] uppercase tracking-[0.2em] font-black">
                        <tr>
                            <th className="px-8 py-5">Product Details</th>
                            <th className="px-8 py-5">Category Path</th>
                            <th className="px-8 py-5">Colors</th>
                            <th className="px-8 py-5">Price & Stock</th>
                            <th className="px-8 py-5 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {products.length > 0 ? (
                            products.map((product) => (
                                <tr key={product._id} className="hover:bg-gray-50/30 transition-colors group">
                                    {/* Image & Info */}
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="relative w-14 h-14 bg-gray-100 rounded-xl overflow-hidden border border-gray-100 flex-shrink-0">
                                                {product.images?.[0] ? (
                                                    <img src={product.images[0]} className="w-full h-full object-cover" alt="" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-300"><PackageOpen size={24} /></div>
                                                )}
                                                {product.images?.length > 1 && (
                                                    <div className="absolute bottom-0 right-0 bg-black/60 text-white text-[8px] px-1 py-0.5 font-bold"><Images size={8} /> {product.images.length}</div>
                                                )}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-bold text-gray-800">{product.name}</span>
                                                    {product.isFeatured && <Star size={14} className="fill-orange-400 text-orange-400" />}
                                                </div>
                                                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">
                                                    {product.brand || 'No Brand'} • {product.gender} • {product.ageGroup}
                                                </div>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Category Path - Fixed with Optional Chaining */}
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-1.5">
                                            <span className="text-xs font-bold text-gray-400">
                                                {product.category?.parentCategory?.name || 'Main'}
                                            </span>
                                            <ChevronRight size={12} className="text-gray-300" />
                                            <span className="px-2.5 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black uppercase tracking-wider border border-blue-100">
                                                {product.category?.name || "Uncategorized"}
                                            </span>
                                        </div>
                                    </td>

                                    {/* Colors */}
                                    <td className="px-8 py-5">
                                        <div className="flex flex-wrap gap-1 max-w-[120px]">
                                            {Array.isArray(product.colors) && product.colors.length > 0 ? (
                                                product.colors.map((color, idx) => (
                                                    <span key={idx} className="px-2 py-0.5 bg-gray-100 border text-gray-500 rounded text-[9px] font-bold">
                                                        {color}
                                                    </span>
                                                ))
                                            ) : (
                                                <span className="text-gray-300 text-[10px] italic">None</span>
                                            )}
                                        </div>
                                    </td>

                                    {/* Price & Stock */}
                                    <td className="px-8 py-5">
                                        <div className="text-base font-black text-gray-900">₹{product.price}</div>
                                        <div className={`text-[10px] font-bold ${product.stock < 10 ? 'text-red-500' : 'text-green-500'}`}>
                                            {product.stock <= 0 ? 'Out of Stock' : `${product.stock} units`}
                                        </div>
                                    </td>

                                    {/* Actions */}
                                    <td className="px-8 py-5 text-center">
                                        <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Link
                                                to={`/dashboard/products/edit/${product._id}`}
                                                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                                            >
                                                <Edit size={18} />
                                            </Link>
                                            <button onClick={() => handleDelete(product._id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="text-center p-10 text-gray-400">No products found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProductTable;