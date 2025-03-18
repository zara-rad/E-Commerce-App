import { Router } from "express";
import multer from "multer";
import {
    createNewUser,
    deleteSingleUser,
    getAllUsers,
    getSingleUser,
    updateSingleUser,
    loginUser,
    verifyToken,
} from "../controllers/userController.js";
import { validators } from "../middlewares/users-validator.js"
import { isAdmin } from "../middlewares/isAdmin.js";
import { auth } from "../middlewares/authentication.js";
const router = Router()
//import { body } from "express-validator";


//INITIONALAIZED (CREATE)MULTER MIDDLEWARE--UPLOAD CAN BE ANY NAME
const upload = multer()

//routes

//GET /products/
router.get("/", auth, isAdmin, getAllUsers)

//GET /verifytoken  from frontend
router.get("/verifytoken", verifyToken)


//GET /products/single product
router.get("/:id", auth, isAdmin, getSingleUser)



//POST /products/

//Express validator : npm install express-validator  -- import body=its a middleware
//req.body ro mikhaim validate konim--this is how user will enter correct name
//body("first_name").exists()
//body("email").isEmail().withMessage("provide a correct email")
//router.post("/", body("email").isEmail().withMessage("provide a correct email"), body("password").isStrongPassword().withMessage("password is too weak!"), createNewUser)
//INSTEAD OF THIS I IMPORTED VALIDATOR
router.post("/", upload.single("profile_image"), validators, createNewUser)

//hameye validatorha ro mishe bord toye ye file dg va faghat inja importesh kard,darvaghe  CUSTOM middleware dorost krdim

// user login
router.post("/login", loginUser);

//PATCH /products/ (update single or existing product)
router.patch("/:id", auth, isAdmin, updateSingleUser)


//DELETE /products/ (delete single product)
router.delete("/:id", auth, isAdmin, deleteSingleUser)


export default router;