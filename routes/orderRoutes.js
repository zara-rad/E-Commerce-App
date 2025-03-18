import { Router } from "express";
import {
    createNewOrder,
    deleteSingleOrder,
    getAllOrders,
    getSingleOrder,
    updateSingleOrder
} from "../controllers/orderController.js";
//import { createNewOrder, deleteSingleOrder, getAllOrders, getSingleOrder, updateSingleOrder } from "../controllers/orderControllers.js";
import { isAdmin } from "../middlewares/isAdmin.js";
import { auth } from "../middlewares/authentication.js";
const router = Router()

//routes

//GET /orders/
router.get("/", auth, isAdmin, getAllOrders)


//GET /orders/single order
router.get("/:id", auth, isAdmin, getSingleOrder)



//POST /orders/
router.post("/", createNewOrder)


//PATCH /orders/ (update single or existing order)
router.patch("/:id", auth, isAdmin, updateSingleOrder)


//DELETE /orders/ (delete single order)
router.delete("/:id", auth, isAdmin, deleteSingleOrder)


export default router;