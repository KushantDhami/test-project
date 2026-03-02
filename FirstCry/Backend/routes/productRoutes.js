import express from "express";
import { 
    createProduct, 
    getAllProducts, 
    deleteProduct, 
    updateProduct, 
    getProductById 
} from "../controllers/product.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import isAdmin from "../middlewares/isAdmin.js";
import { upload } from "../middlewares/multer.js"; 


const router = express.Router();

router.route("/create").post(
    isAuthenticated, 
    isAdmin, 
    upload.array("product_images", 8), 
    createProduct
);

router.route("/all").get(isAuthenticated, getAllProducts);
router.route("/:id").get(isAuthenticated, getProductById);

router.route("/update/:id").put(
    isAuthenticated, 
    isAdmin, 
    upload.array("product_images", 8), 
    updateProduct
);

router.route("/delete/:id").delete(isAuthenticated, isAdmin, deleteProduct);

export default router;