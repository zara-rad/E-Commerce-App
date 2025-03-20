import UsersModel from "../models/usersSchema.js"
//import { validationResult } from "express-validator"
import bcrypt from "bcrypt"
import { body } from "express-validator"
//npm i jsonwebtoken == to get and create unique token
import jwt from "jsonwebtoken"
import ImageModel from "../models/imageSchema.js"
import { transporter } from "../server.js"







//GET
export const getAllUsers = async (req, res, next) => {
    //get all users from DB and send to client
    try {

        //Express validator : npm install express-validator  -- import body=its a middleware
        //req.body ro mikhaim validate konim--this is how user will enter correct name
        //body("first_name").exists()
        //body("email").isEmail().withMessage("provide a correct email")
        //we write it as middleware in POST ROUTER in User route
        const users = await UsersModel.find()//reading data from users collection
        res.send({ success: true, data: users })
    } catch (err) {
        //res.send({ success: false, message: err.message })
        next(err)
    }
}

//GET single user
export const getSingleUser = async (req, res, next) => {
    //get all users from DB and send to client
    try {
        /*   const singleUser = await UsersModel.findById(req.params.id).populate("orders")
          res.send({ success: true, data: singleUser }) */
        const singleUser = await UsersModel.findById(req.param.id).populate(
            "orders")
        res.dend({ success: true, data: singleUser })
    } catch (err) {
        //res.send({ success: false, message: err.message })
        next(err)
    }
    //res.send("We recieved get request on /users")
}


//POST single user--create user

export const createNewUser = async (req, res, next) => {
    //create new user in DB and send to client
    //AFTER WRITING EXPRESS VALIDATOR: CATCH ANY ERROR FROM EXPRESS VALIDATOR
    //EXPRESS MIDDLEWARE JUST SEND OUR REQUEST=WE SHOULD IMPORT VALIDATIONRESULR ON TOP
    try {
        // const results = validationResult(req)
        //AFTER WRITING EXPRESS VALIDATOR: CATCH ANY ERROR FROM EXPRESS VALIDATOR
        //EXPRESS MIDDLEWARE JUST SEND OUR REQUEST=WE SHOULD IMPORT VALIDATIONRESULR ON TOP
        //bad az sakhtan file validator mishe hame inaro bebarim to oon file


        /*   if (results.isEmpty()) {
              //hash user's password before creating user-10:salt everytime create unique pass
             
              const user = await UsersModel.create(req.body)//reading data from users collection
              res.send({ success: true, data: user })
          } else {
              req.send({
                  success: false, message: results.errors
              });
          }
   */
        // hash user password before creating user
        const hashedPassword = bcrypt.hashSync(req.body.password, 10)
        req.body.password = hashedPassword
        //ON req.body WE GET SOME INGO,BUT FOR GETTING IMG INFO WE WRITE req.file
        if (req.file) {
            //its getting img info from imagemodel
            //SAVE DATA IN DB
            const image = await ImageModel.create({
                fileName: Date.now() + "_" + req.file.originalname,
                data: req.file.buffer
            })
            req.body.profile_avatar = "https://e-commerce-app-terv.onrender.com/images/" + image.fileName;
        }
        const user = await UsersModel.create(req.body);
        //VERIFY 17 MARCH

        const token = jwt.sign(
            { _id: user._id, email: user.email },
            process.env.SECRET_KEY
        );
        console.log(token)
        try {
            const confirmation_link = `https://e-commerce-app-terv.onrender.com/verifyemail/${token}`
            await transporter.sendMail({
                from: "no-reply@e-store.com",
                to: user.email,
                subject: "Verify your email",
                //ITS THE BODY PART OF YOUR EMAIL   target="_blank" direct user to different tab
                html: `<div><h1>Please confirm your email</h1><a href=${confirmation_link} target="_blank">Verify Email</a> </div>`
            })//TILL HERE 

        } catch (error) {
            console.log(error.message)

        }

        res.send({ success: true, data: user });


    } catch (err) {
        // res.send({ success: false, message: err.message })
        next(err)
    }
    //res.send("We recieved post request on /users")
}
export const loginUser = async (req, res, next) => {
    try {
        //  "email":"test3@gmail.com",
        //    "password":"Helloworld@123"
        console.log(req.body)
        // in db hashed password  => $2b$10$O5hTpQOgcWYYTvAFYWzSQuBcVITFAvsmtdEsPqJNq3Pzok5eaYOYe
        const user = await UsersModel.findOne({ email: req.body.email });
        if (user) {
            const check = bcrypt.compareSync(req.body.password, user.password);

            if (check) {
                console.log("check for error")
                //authenticate the user
                // issue token jwt.sign(payload, secretkey(signature))
                if (user.confirmEmail) {
                    const token = jwt.sign(
                        { _id: user._id, email: user.email },
                        process.env.SECRET_KEY
                    );
                    //res.send({ success: true, data: user, token });
                    res.header("token", token).send({ success: true, data: user });

                } else {
                    throw new Error("Please confirm your email before login...");

                }

            } else {
                throw new Error("passowrd doesnt match..");
            }
        } else {
            throw new Error("no such email exist ...");
        }
    } catch (err) {
        next(err);
    }
};

//PATCH updating single user
export const updateSingleUser = async (req, res, next) => {
    //update user in DB and send to client
    try {
        //find the item,update it depends on id and change it on body/accept the update by this code:{ new: true }
        const updatedUser = await UsersModel.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true })
        res.send({ success: true, data: updatedUser })
    } catch (err) {
        //res.send({ success: false, message: err.message })
        next(err)
    }
    //res.send("We recieved patch request on /users")
}


//DELETE single user
export const deleteSingleUser = async (req, res, next) => {
    try {
        const deletedUser = await UsersModel.findByIdAndDelete(req.params.id)
        res.send({ success: true, data: deletedUser })

    } catch (err) {
        //res.send({ success: false, message: err.message })
        next(err)
    }


    //UsersModel.deleteManyy()... delete everything
    //UsersModel.deleteManyy("price":2000)... delete all users with this price

    //res.send("We recieved delete request on /users")
}


//create verify func to verify the token and show in profile
export const verifyToken = async (req, res, next) => {
    try {
        const token = req.headers.token
        console.log(token)
        const payload = jwt.verify(token, process.env.SECRET_KEY)
        if (!payload) {
            return next("Token is invalid")
        } else {
            //if token is correct show all info in profile page in frontend
            const user = await UsersModel.findById(payload._id)
            res.send({ success: true, data: user })
        }
    } catch (err) {
        next(err)
    }
}

//model.find()
//model.findById()
//model.findOne()
//model.create()
////model.findByIdAndUpdate()
////model.findByIdAndDelete()
