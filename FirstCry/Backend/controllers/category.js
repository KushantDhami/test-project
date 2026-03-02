import { Category } from "../models/categoryModel.js";

export const createCategory = async (req, res) => {
    try {
        const { name, parentCategory } = req.body;

        const existingCategory = await Category.findOne({ name });
        if (existingCategory) {
            return res.status(400).json({ message: "Category already exists" });
        }

      
        const category = await Category.create({
            name,
            parentCategory: parentCategory || null
        });

        return res.status(201).json({
            message: "Category created successfully",
            category,
            success: true
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server Error" });
    }
};

export const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        return res.status(200).json({
            success: true,
            categories
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server Error" });
    }
};