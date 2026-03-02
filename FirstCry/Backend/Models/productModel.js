import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    brand: {
        type: String
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true
    },
    ageGroup: {
        type: String,
        enum: ["0-3M", "3-6M", "6-12M", "1-2Y", "2-4Y", "4-6Y"],
        required: true
    },
    gender: {
        type: String,
        enum: ["Boy", "Girl"],
        required: true
    },
    colors: {
        type: [String], 
        required: true,
        default: []     
    },
    price: {
        type: Number,
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    images: {
        type: [String], 
        default: []
    },
    isFeatured: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

export const Product = mongoose.model("Product", productSchema);