import express from "express";
import { createCategory , getAllCategories} from "../controllers/category.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import isAdmin from "../middlewares/isAdmin.js";

const router = express.Router();

router.route("/create").post(isAuthenticated,isAdmin,createCategory);
router.route("/all").get(isAuthenticated,getAllCategories);


export default router;