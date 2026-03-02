import { Product } from "../models/productModel.js";
import cloudinary from "../utils/cloudinary.js";
import getDataUri from "../utils/datauri.js";

export const createProduct = async (req, res) => {
    try {
        const { 
            name, description, brand, category, 
            ageGroup, gender, price, stock, colors, isFeatured 
        } = req.body;

        const files = req.files;

        if (!name || !description || !price || !stock) {
            return res.status(400).json({ success: false, message: "Required fields missing" });
        }

        let colorArray = [];
        if (colors && typeof colors === 'string') {
            colorArray = colors.split(',').map(c => c.trim()).filter(c => c !== "");
        } else if (Array.isArray(colors)) {
            colorArray = colors;
        }

      
        let imageUrls = [];
        if (files && files.length > 0) {
            const uploadPromises = files.map(file => {
                const fileUri = getDataUri(file);
                return cloudinary.uploader.upload(fileUri.content, { folder: "FirstCry_Products" });
            });
            const results = await Promise.all(uploadPromises);
            imageUrls = results.map(r => r.secure_url);
        }

        const product = await Product.create({
            name,
            description,
            brand,
            category,
            ageGroup,
            gender,
            price: Number(price),
            stock: Number(stock),
            colors: colorArray,
            images: imageUrls,
            isFeatured: isFeatured === 'true' || isFeatured === true
        });

        return res.status(201).json({ 
            success: true, 
            message: "Product created successfully", 
            product 
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { 
            name, description, brand, category, 
            ageGroup, gender, price, stock, colors, 
            isFeatured, existingImages 
        } = req.body;

        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        // --- 1. HANDLE COLORS ---
        let colorArray = product.colors;
        if (colors !== undefined && typeof colors === 'string') {
            colorArray = colors.split(',').map(c => c.trim()).filter(c => c !== "");
        }

        // --- 2. HANDLE IMAGES ---
        let finalImages = [];
        // Parse existing images if they come as a stringified array
        if (existingImages) {
            try {
                finalImages = typeof existingImages === 'string' ? JSON.parse(existingImages) : existingImages;
            } catch (e) {
                finalImages = product.images; 
            }
        }

        // Add new uploaded images
        if (req.files && req.files.length > 0) {
            const uploadPromises = req.files.map(file => {
                const fileUri = getDataUri(file);
                return cloudinary.uploader.upload(fileUri.content, { folder: "FirstCry_Products" });
            });
            const cloudResults = await Promise.all(uploadPromises);
            const newUrls = cloudResults.map(r => r.secure_url);
            finalImages = [...finalImages, ...newUrls];
        }

        // --- 3. UPDATE PRODUCT (CRASH FIXED HERE) ---
        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            {
                name: name || product.name,
                description: description || product.description,
                brand: brand || product.brand,
                
                // 👇 THE FIX: If category is empty string "", use the OLD category
                category: (category && category !== "") ? category : product.category, 
                
                ageGroup: ageGroup || product.ageGroup,
                gender: gender || product.gender,
                price: price ? Number(price) : product.price,
                stock: stock ? Number(stock) : product.stock,
                colors: colorArray,
                images: finalImages,
                
                // Keep old Featured status if not provided
                isFeatured: isFeatured !== undefined ? (isFeatured === 'true' || isFeatured === true) : product.isFeatured
            },
            { new: true, runValidators: true }
        ).populate({
            path: 'category',
            populate: { path: 'parentCategory', model: 'Category' }
        });

        return res.status(200).json({
            success: true,
            message: "Product updated successfully",
            product: updatedProduct
        });

    } catch (error) {
        console.error("Update Error:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find()
            .populate({
                path: 'category',
                populate: { path: 'parentCategory', model: 'Category' }
            })
            .sort({ createdAt: -1 });

        return res.status(200).json({ success: true, products });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate({
            path: 'category',
            populate: { path: 'parentCategory' }
        });
        if (!product) return res.status(404).json({ success: false, message: "Product not found" });
        return res.status(200).json({ success: true, product });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) return res.status(404).json({ success: false, message: "Product not found" });
        return res.status(200).json({ success: true, message: "Product deleted successfully" });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};