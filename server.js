import express from "express";
import mongoose from "mongoose";
import { config } from "dotenv";
config();
import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import { auth } from "./middlewares/authentication.js";
import { Stripe } from "stripe";
const stripe = new Stripe(process.env.STRIPE_KEY);
import cors from "cors";
import ImageModel from "./models/imageSchema.js";
import { Readable } from "stream";
import cookieParser from "cookie-parser";
import nodemailer from "nodemailer"
import UserModel from "./models/usersSchema.js";
import jwt from "jsonwebtoken"
//import { body } from "express-validator"
console.clear()
//CREATE CONNECTION TO OUR GMAIL
export const transporter = nodemailer.createTransport({
    //depends on the host which we are using  next line should change as well,for now we use our own gmail
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // upgrade later with STARTTLS
    auth: {
        user: "zahra.rafieirad1980@gmail.com",
        pass: process.env.NODEMAILER_PASS,
    },
});





console.clear()
const PORT = process.env.PORT || 5000;

//make a mongoose connection
try {
    await mongoose.connect(process.env.MONGO_URI, { dbName: "e-store" });
    console.log("mongodb connected!");
} catch (err) {
    console.log(err.message);
}

//creating server
const app = express();
//cors middleware
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

//serve static files
app.use(express.static("views"));
//json middleware
app.use(express.json()); // parse any incoming json data and store in req.body


//cookie parser middleware( parse your cookie header and give cookies data in req.cookies)
app.use(cookieParser());
//verify email toke
app.get("/verifyemail/:token", async (req, res, next) => {
    try {
        const { token } = req.params
        const decoded = jwt.verify(token, process.env.SECRET_KEY)//it returns payload
        if (!decoded)
            return res.send({ sucsess: false, message: "Incvalid token...!" })
        //FIRST WAY  --more readable way than second way
        /* const user = await UsersModel.findById(decoded._id)
        user.confirmEmail = true
        await user.save() //storing user in DB */
        //SECOND WAY
        const updatedUser = await UserModel.findByIdAndUpdate(decoded._id, { $set: { confirmEmail: true } }, { new: true })
        res.send({ sucsess: true, data: updatedUser, message: "Thanks for confirming your email!" })

    } catch (err) {
        res.send({ sucsess: false, message: err.message })
    }
})




//if user verified (auth) and login can place order
app.post("/create-checkout-session", auth, async (req, res) => {
    const { cart } = req.body;
    console.log(cart);
    const session = await stripe.checkout.sessions.create({
        line_items: cart.map((item) => {
            return {
                price_data: {
                    currency: "eur",
                    product_data: {
                        name: item.name,
                        images: [item.image[0], item.image[1]],
                    },
                    unit_amount: parseInt(item.price * 100),
                },
                quantity: item.quantity,
            };
        }),

        mode: "payment",
        success_url: `https://e-commerce-app-terv.onrender.com/?success=true`,
        cancel_url: `https://e-commerce-app-terv.onrender.com/?canceled=true`,

        metadata: {
            //WE NEED PRODUCTS_ID TO PLACE ORDER IN DB
            //metadata only accept String so we change object and array of product to string
            productIds: cart.map((item) => item._id).join(","),
            userId: req.user._id.toString()
        }
    });

    res.send({ id: session.id });
});

// This is your Stripe CLI webhook secret for testing your endpoint locally.
const endpointSecret = process.env.SIGNING_SECRET;

app.post('/webhook', express.raw({ type: 'application/json' }), (request, response) => {
    const sig = request.headers['stripe-signature'];

    let event;

    try {
        event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
    } catch (err) {
        response.status(400).send(`Webhook Error: ${err.message}`);
        return;
    }

    // Handle the event
    switch (event.type) {
        case 'checkout.session.completed':
            const session = event.data.object;
            console.log(session)
            // Then define and call a function to handle the event checkout.session.completed
            break;
        // ... handle other event types
        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    // Return a 200 response to acknowledge receipt of the event
    response.send();
});









//middleware (its a function , it receives 3 parameters , req,res,next) ,can send back response to client or forward your request to next handler



//Routes
app.use("/products", productRoutes);
app.use("/users", userRoutes);
app.use("/orders", auth, orderRoutes);

app.get("/images/:filename", async (req, res, next) => {
    try {
        const image = await ImageModel.findOne({ filename: req.params.filename });
        if (image) {
            const readStream = Readable.from(image.data);
            readStream.pipe(res);
        } else {
            next("no such image found!");
        }
    } catch (err) {
        next(err);
    }
});

//error handling middleware
//next(err)
app.use((err, req, res, next) => {
    res.status(err.status || 500).send({ success: false, message: err.message });
});

//page not found error handler
app.use((req, res, next) => {
    res
        .status(404)
        .send({ success: false, message: "no such route exist in our server!" });
});

app.listen(PORT, () => console.log("server is running 🚀 on port: ", PORT));

// hashing bcrypt
// bcrypt.hashSync(plain password, saltrounds) ..hashing password
// bcrypt.compareSync(plain password, hashed password) verifing password

// authentication Jsonwebtoken
// jwt.sign(payload, secret key) create token
// jwt.verify(token, secret key) verifying token





