import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, X, Loader2, ImageIcon, Save } from 'lucide-react';

const AddProduct = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    
   
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

    const [images, setImages] = useState([]);
    const [imagePreview, setImagePreview] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                
                const res = await axios.get('http://localhost:3000/api/category/all', {
                    withCredentials: true
                });
                if (res.data && res.data.success) {
                    const cats = res.data.categories || [];
                    setAllCategories(cats);
                    setParentCategories(cats.filter(cat => !cat.parentCategory));
                }
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };
        fetchCategories();
    }, []);

    
    const handleParentChange = (e) => {
        const parentId = e.target.value;
        setFormData({ ...formData, parentCategory: parentId, category: '' });
        
        if (!parentId) {
            setSubCategories([]);
            return;
        }

        const filtered = allCategories.filter(cat => {
            const pid = cat.parentCategory?._id || cat.parentCategory;
            return pid === parentId;
        });
        setSubCategories(filtered);
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (images.length + files.length > 8) {
            return alert("Maximum 8 images allowed");
        }
        setImages(prev => [...prev, ...files]);
        const previews = files.map(file => URL.createObjectURL(file));
        setImagePreview(prev => [...prev, ...previews]);
    };

    const removeImage = (index) => {
        setImages(images.filter((_, i) => i !== index));
        setImagePreview(imagePreview.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const submitData = new FormData();
            
            submitData.append('name', formData.name);
            submitData.append('description', formData.description);
            submitData.append('brand', formData.brand);
            submitData.append('category', formData.category); // Child ID
            submitData.append('ageGroup', formData.ageGroup);
            submitData.append('gender', formData.gender);
            submitData.append('price', formData.price);
            submitData.append('stock', formData.stock);
            submitData.append('colors', formData.colors);
            submitData.append('isFeatured', formData.isFeatured);

            images.forEach(image => {
                submitData.append('product_images', image);
            });

            const res = await axios.post('http://localhost:3000/api/product/create', submitData, {
                withCredentials: true,
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (res.data.success) {
                alert('Product created successfully!');
                navigate('/dashboard/products'); 
            }
        } catch (error) {
            alert(error.response?.data?.message || 'Error creating product');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto p-4 md:p-6 bg-gray-50 min-h-screen">
            <div className="flex items-center justify-between mb-8">
                <button 
                    onClick={() => navigate('/dashboard/products')} 
                    className="flex items-center gap-2 text-gray-500 hover:text-blue-600 font-semibold transition-all"
                >
                    <ArrowLeft size={20} /> BACK
                </button>
                <h1 className="text-2xl font-bold text-gray-800">Add New Product</h1>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Left Side: Content */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-2xl border shadow-sm">
                        <h2 className="font-bold text-gray-700 flex items-center gap-2 mb-4">
                            <ImageIcon size={18} className="text-blue-500"/> Images
                        </h2>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {imagePreview?.map((src, index) => (
                                <div key={index} className="relative aspect-square rounded-xl overflow-hidden border group">
                                    <img src={src} className="w-full h-full object-cover" alt="preview" />
                                    <button 
                                        type="button" 
                                        onClick={() => removeImage(index)}
                                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity"
                                    >
                                        <X size={14}/>
                                    </button>
                                </div>
                            ))}
                            {imagePreview.length < 8 && (
                                <label className="aspect-square border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50 transition-all">
                                    <Plus className="text-gray-400" size={24} />
                                    <input type="file" multiple className="hidden" onChange={handleImageChange} accept="image/*" />
                                </label>
                            )}
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border shadow-sm space-y-4">
                        <input required name="name" value={formData.name} onChange={handleInputChange} placeholder="Product Name" className="w-full p-3 border rounded-xl outline-none focus:border-blue-500" />
                        <textarea required name="description" value={formData.description} onChange={handleInputChange} rows="5" placeholder="Description" className="w-full p-3 border rounded-xl outline-none focus:border-blue-500" />
                        <input name="colors" value={formData.colors} onChange={handleInputChange} placeholder="Colors (e.g. Red, Blue)" className="w-full p-3 border rounded-xl outline-none" />
                    </div>
                </div>

                {/* Right Side: Sidebar */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-2xl border shadow-sm space-y-4">
                        <h3 className="font-bold text-gray-800 text-sm uppercase border-b pb-2">Category</h3>
                        
                        <select required className="w-full p-3 border rounded-xl bg-gray-50" value={formData.parentCategory} onChange={handleParentChange}>
                            <option value="">Main Category</option>
                            {parentCategories?.map(cat => (
                                <option key={cat._id} value={cat._id}>{cat.name}</option>
                            ))}
                        </select>

                        <select disabled={!formData.parentCategory} className="w-full p-3 border rounded-xl bg-gray-50 disabled:opacity-50" name="category" value={formData.category} onChange={handleInputChange}>
                            <option value="">Subcategory</option>
                            {subCategories?.map(sub => (
                                <option key={sub._id} value={sub._id}>{sub.name}</option>
                            ))}
                        </select>
                        
                        <input name="brand" value={formData.brand} onChange={handleInputChange} placeholder="Brand" className="w-full p-3 border rounded-xl outline-none" />
                    </div>

                    <div className="bg-white p-6 rounded-2xl border shadow-sm space-y-4">
                        <h3 className="font-bold text-gray-800 text-sm uppercase border-b pb-2">Price & Stock</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <input required type="number" name="price" value={formData.price} onChange={handleInputChange} placeholder="Price" className="w-full p-3 border rounded-xl" />
                            <input required type="number" name="stock" value={formData.stock} onChange={handleInputChange} placeholder="Stock" className="w-full p-3 border rounded-xl" />
                        </div>
                        <select className="w-full p-3 border rounded-xl" name="ageGroup" value={formData.ageGroup} onChange={handleInputChange}>
                            {["0-3M", "3-6M", "6-12M", "1-2Y", "2-4Y", "4-6Y"].map(a => <option key={a} value={a}>{a}</option>)}
                        </select>
                        <select className="w-full p-3 border rounded-xl" name="gender" value={formData.gender} onChange={handleInputChange}>
                            <option value="Boy">Boy</option>
                            <option value="Girl">Girl</option>
                        </select>
                        <div className="flex items-center justify-between px-2">
                            <span className="text-sm font-bold text-gray-600">Featured?</span>
                            <input type="checkbox" name="isFeatured" checked={formData.isFeatured} onChange={handleInputChange} className="w-5 h-5 accent-blue-600" />
                        </div>
                    </div>

                    <button disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-lg flex items-center justify-center gap-2">
                        {loading ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                        {loading ? "SAVING..." : "PUBLISH"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddProduct;