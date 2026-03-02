import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Save, Plus, X, Loader2, ImageIcon, Star } from 'lucide-react';

const EditProduct = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    
    // Taxonomy States
    const [allCategories, setAllCategories] = useState([]);
    const [parentCategories, setParentCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        brand: '',
        parentCategory: '', 
        category: '',       
        ageGroup: '0-3M',   
        gender: 'Boy',      
        price: '',
        stock: '',
        colors: '',
        isFeatured: false
    });

    const [existingImages, setExistingImages] = useState([]); 
    const [newFiles, setNewFiles] = useState([]); 
    const [newPreviews, setNewPreviews] = useState([]);

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const catRes = await axios.get('http://localhost:3000/api/category/all', { withCredentials: true });
                const cats = catRes.data.categories || [];
                setAllCategories(cats);
                setParentCategories(cats.filter(c => !c.parentCategory));

                const prodRes = await axios.get(`http://localhost:3000/api/product/${id}`, { withCredentials: true });
                if (prodRes.data.success) {
                    const p = prodRes.data.product;
                    
                    setFormData({
                        name: p.name || '',
                        description: p.description || '',
                        brand: p.brand || '',
                        parentCategory: p.category?.parentCategory?._id || p.category?.parentCategory || '',
                        category: p.category?._id || p.category || '',
                        ageGroup: p.ageGroup || '0-3M',
                        gender: p.gender || 'Boy',
                        price: p.price || '',
                        stock: p.stock || '',
                        colors: Array.isArray(p.colors) ? p.colors.join(', ') : '',
                        isFeatured: p.isFeatured || false
                    });

                    setExistingImages(p.images || []);

                    const parentId = p.category?.parentCategory?._id || p.category?.parentCategory;
                    if (parentId) {
                        const filtered = cats.filter(c => (c.parentCategory?._id || c.parentCategory) === parentId);
                        setSubCategories(filtered);
                    }
                }
            } catch (error) {
                console.error("Fetch Error:", error);
                alert("Failed to load product data");
            } finally {
                setFetching(false);
            }
        };
        fetchInitialData();
    }, [id]);


    const handleParentChange = (e) => {
        const parentId = e.target.value;
        setFormData({ ...formData, parentCategory: parentId, category: '' });
        const filtered = allCategories.filter(c => (c.parentCategory?._id || c.parentCategory) === parentId);
        setSubCategories(filtered);
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

   
    const handleNewImageSelection = (e) => {
        const files = Array.from(e.target.files);
        setNewFiles(prev => [...prev, ...files]);
        const previews = files.map(file => URL.createObjectURL(file));
        setNewPreviews(prev => [...prev, ...previews]);
    };

    const removeExistingImage = (url) => {
        setExistingImages(existingImages.filter(img => img !== url));
    };

    const removeNewPreview = (index) => {
        setNewFiles(newFiles.filter((_, i) => i !== index));
        setNewPreviews(newPreviews.filter((_, i) => i !== index));
    };

    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const updateData = new FormData();
            
           
            Object.keys(formData).forEach(key => updateData.append(key, formData[key]));
            
            updateData.append('existingImages', JSON.stringify(existingImages));

            
            newFiles.forEach(file => {
                updateData.append('product_images', file);
            });

            const res = await axios.put(`http://localhost:3000/api/product/update/${id}`, updateData, {
                withCredentials: true,
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (res.data.success) {
                alert('Product successfully updated!');
                navigate('/dashboard/products');
            }
        } catch (error) {
            alert(error.response?.data?.message || 'Update failed');
        } finally {
            setLoading(false);
        }
    };

    if (fetching) return (
        <div className="flex flex-col items-center justify-center min-h-screen text-gray-400">
            <Loader2 className="animate-spin mb-4" size={40} />
            <p className="font-bold uppercase tracking-widest text-xs">Fetching Inventory Details...</p>
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto p-4 md:p-8 bg-gray-50 min-h-screen">
            <div className="flex items-center justify-between mb-10">
                <button onClick={() => navigate('/dashboard/products')} className="flex items-center gap-2 text-gray-500 hover:text-black font-black text-xs uppercase tracking-tighter transition-all">
                    <ArrowLeft size={16} /> Cancel Editing
                </button>
                <h1 className="text-3xl font-black text-gray-900 tracking-tighter uppercase">Edit Product</h1>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                
                {/* Left Column: Visuals & Content */}
                <div className="lg:col-span-2 space-y-8">
                    
                    {/* Multi-Image Amazon Style Gallery */}
                    <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
                        <h2 className="font-black text-gray-800 text-sm uppercase tracking-widest mb-6 flex items-center gap-2">
                            <ImageIcon size={18} className="text-blue-500"/> Product Media
                        </h2>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {/* Render Existing Images */}
                            {existingImages.map((src, index) => (
                                <div key={`old-${index}`} className="relative aspect-square rounded-2xl overflow-hidden border border-gray-100 group bg-gray-50">
                                    <img src={src} className="w-full h-full object-cover" alt="current" />
                                    <button type="button" onClick={() => removeExistingImage(src)} className="absolute top-2 right-2 bg-black text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <X size={12}/>
                                    </button>
                                    <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm text-[8px] px-2 py-0.5 rounded-full font-bold uppercase">Stored</div>
                                </div>
                            ))}
                            {/* Render New Selection Previews */}
                            {newPreviews.map((src, index) => (
                                <div key={`new-${index}`} className="relative aspect-square rounded-2xl overflow-hidden border-2 border-blue-100 group shadow-inner">
                                    <img src={src} className="w-full h-full object-cover" alt="new" />
                                    <button type="button" onClick={() => removeNewPreview(index)} className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5">
                                        <X size={12}/>
                                    </button>
                                    <div className="absolute bottom-2 left-2 bg-blue-500 text-white text-[8px] px-2 py-0.5 rounded-full font-bold uppercase">New</div>
                                </div>
                            ))}
                            {/* Add More Trigger */}
                            {(existingImages.length + newFiles.length) < 8 && (
                                <label className="aspect-square border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 hover:border-blue-400 transition-all">
                                    <Plus className="text-gray-300" size={30} />
                                    <input type="file" multiple className="hidden" onChange={handleNewImageSelection} accept="image/*" />
                                </label>
                            )}
                        </div>
                    </div>

                    {/* Core Product Info */}
                    <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 space-y-6">
                        <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Display Title</label>
                            <input required name="name" value={formData.name} onChange={handleInputChange} className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500/20 outline-none font-bold text-gray-800" />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Detailed Description</label>
                            <textarea required name="description" value={formData.description} onChange={handleInputChange} rows="6" className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500/20 outline-none font-medium text-gray-600" />
                        </div>
                    </div>
                </div>

                {/* Right Column: Settings & Actions */}
                <div className="space-y-8">
                    {/* Classification */}
                    <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 space-y-5">
                        <h3 className="font-black text-gray-800 text-[10px] uppercase tracking-[0.2em] mb-4 border-b border-gray-50 pb-4">Classification</h3>
                        <select required className="w-full p-4 bg-gray-50 border-none rounded-2xl outline-none font-bold text-gray-700 appearance-none" value={formData.parentCategory} onChange={handleParentChange}>
                            <option value="">Main Category</option>
                            {parentCategories?.map(cat => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
                        </select>
                        <select disabled={!formData.parentCategory} className="w-full p-4 bg-gray-50 border-none rounded-2xl outline-none font-bold text-gray-700 disabled:opacity-50" name="category" value={formData.category} onChange={handleInputChange}>
                            <option value="">Subcategory</option>
                            {subCategories?.map(sub => <option key={sub._id} value={sub._id}>{sub.name}</option>)}
                        </select>
                        <input name="brand" value={formData.brand} onChange={handleInputChange} className="w-full p-4 bg-gray-50 border-none rounded-2xl outline-none font-bold" placeholder="Brand Name" />
                        <input name="colors" value={formData.colors} onChange={handleInputChange} className="w-full p-4 bg-gray-50 border-none rounded-2xl outline-none font-bold text-blue-600" placeholder="Colors (Comma Separated)" />
                    </div>

                    {/* Inventory & Pricing */}
                    <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 space-y-5">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[8px] font-black text-gray-400 uppercase mb-1">Price (₹)</label>
                                <input required type="number" name="price" value={formData.price} onChange={handleInputChange} className="w-full p-4 bg-gray-50 border-none rounded-2xl font-black text-gray-900" />
                            </div>
                            <div>
                                <label className="block text-[8px] font-black text-gray-400 uppercase mb-1">In Stock</label>
                                <input required type="number" name="stock" value={formData.stock} onChange={handleInputChange} className="w-full p-4 bg-gray-50 border-none rounded-2xl font-black text-gray-900" />
                            </div>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-orange-50/50 rounded-2xl">
                            <span className="text-[10px] font-black text-orange-600 uppercase flex items-center gap-2">
                                <Star size={14} className={formData.isFeatured ? 'fill-orange-500 text-orange-500' : 'text-orange-200'}/> Featured
                            </span>
                            <input type="checkbox" name="isFeatured" checked={formData.isFeatured} onChange={handleInputChange} className="w-5 h-5 accent-orange-500" />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-5 rounded-[2rem] shadow-xl shadow-blue-100 transition-all flex items-center justify-center gap-3 tracking-widest uppercase text-xs">
                        {loading ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                        {loading ? "Syncing..." : "Update Inventory"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditProduct;