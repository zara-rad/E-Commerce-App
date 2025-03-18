import OrdersModel from "../models/ordersSchema.js"
import UserModel from "../models/usersSchema.js"

//GET
export const getAllOrders = async (req, res, next) => {
    //get all orders from DB and send to client
    try {
        //by addin .populate("userId") we can see name of user instead of user id--it gows to user collection and fetch info from user id
        //"first_name,-_id" : we say just show firstname and dont show id(filtering data)
        const orders = await OrdersModel.find()
            .populate("userId", "first_name -_id")
            .populate("products", "title totalPrice")//reading data from orders collection
        res.send({ success: true, data: orders })

    } catch (err) {
        //we wrote middleware so we can get rid of this line from whole code and just write next()
        //res.send({ success: false, message: err.message })
        next(err)
    }
}

//GET single order
export const getSingleOrder = async (req, res, next) => {
    //get all orders from DB and send to client
    try {
        const singleOrder = await OrdersModel.findById(req.params.id)
        res.send({ success: true, data: singleOrder })

    } catch (err) {
        //res.send({ success: false, message: err.message })
        next(err)
    }

    //res.send("We recieved get request on /orders")
}


//POST single order--create order
export const createNewOrder = async (req, res, next) => {
    //create new order in DB and send to client
    try {
        const order = await OrdersModel.create(req.body)//reading data from orders collection


        /*  userId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    //products: [],
    products: [{ type: Schema.Types.ObjectId, ref: "Product" }],

    totalPrice: { type: Number, required: true }, */
        //1TH WAY OF SAVING ORDERS
        /* const user = await UserModel.findById(req.body.userId)
        user.orders.push(order._id)
        await user.save() */


        //2TH WAY OF SAVING ORDERS
        const user = await UserModel.findByIdAndUpdate(
            req.body.userId, { $push: { orders: order._id } },
            { new: true })

        res.send({ success: true, data: order })

    } catch (err) {
        //res.send({ success: false, message: err.message })
        next(err)
    }

    //res.send("We recieved post request on /orders")
}

//PATCH updating single order
export const updateSingleOrder = async (req, res, next) => {
    //update order in DB and send to client
    try {
        //find the item,update it depends on id and change it on body/accept the update by this code:{ new: true }
        const updatedOrder = await OrdersModel.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true })
        res.send({ success: true, data: updatedOrder })
    } catch (err) {
        next(err)
    }
}


//DELETE single order
export const deleteSingleOrder = async (req, res, next) => {
    try {
        const deletedOrder = await OrdersModel.findByIdAndDelete(req.params.id)
        res.send({ success: true, data: deletedOrder })

    } catch (err) {
        //res.send({ success: false, message: err.message })
        next(err)
    }



}


