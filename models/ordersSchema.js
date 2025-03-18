import { Schema, model } from "mongoose"
const orderSchema = new Schema({
    //IN THIS WAY ALWAYS WE GET ID OF USER,WE DONT KNOW WHICH ORDER OLACED IN ORDER LIST
    //userId: { type: String, required: true },
    //BUT HERE WE GET THE NAME OF USER. we use user or product in their own schema.they must have the same name
    userId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    //products: [],
    products: [{ type: Schema.Types.ObjectId, ref: "Product" }],

    totalPrice: { type: Number, required: true },

}, { timestamps: true })

//creating model
const OrderModel = model("Order", orderSchema)
export default OrderModel
//then import it to controller to get,add ...orders in controller */