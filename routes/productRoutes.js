import { Router } from "express";
import {
    createNewProduct,
    deleteSingleProduct,
    getAllProducts,
    getSingleProduct,
    updateSingleProduct
} from "../controllers/productControllers.js";
import { isAdmin } from "../middlewares/isAdmin.js";
import { auth } from "../middlewares/authentication.js";
const router = Router()

//routes

//GET /products/
router.get("/", getAllProducts)


//GET /products/single product
router.get("/:id", getSingleProduct)



//POST /products/
router.post("/", auth, isAdmin, createNewProduct)


//PATCH /products/ (update single or existing product)
router.patch("/:id", auth, isAdmin, updateSingleProduct)


//DELETE /products/ (delete single product)
router.delete("/:id", auth, isAdmin, deleteSingleProduct)


export default router;