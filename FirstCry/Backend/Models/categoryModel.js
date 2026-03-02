import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true, 
        unique: true 
    },
    parentCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category", 
        default: null
    }
}, { timestamps: true });

export const Category = mongoose.model("Category", categorySchema);